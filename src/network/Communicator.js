import Resultaat from "../model/Resultaat";
import * as wellKnown from 'wellknown'
import getIndexOfClasses from './allClasses'

let latestString = "";

/**
 * Vind een match. Dit zoekt op exact en contains.
 * @param text de geschreven text.
 *
 * Als je het opnieuw wilt implementeren moet deze er in blijven. Je zal een string krijgen
 * @returns {Promise<string|undefined>}
 */
export async function getMatch(text) {
    latestString = text;

    // let exactMatch = await queryPDOK(nameQueryExactMatchPDOK(firstLetterCapital(text)));
    let exactMatch = await queryTriply(nameQueryExactMatch(firstLetterCapital(text)));
    exactMatch = await exactMatch.text();
    exactMatch = makeSearchScreenResults(JSON.parse(exactMatch));

    if (latestString !== text) {
        return undefined;
    } else if (exactMatch.status > 300) {
        return "error";
    }
    // else if(exactMatch.length > 35){
    //     return exactMatch;
    // }

    let result = await queryTriply(nameQueryForRegexMatch(text));

    if (latestString !== text) {
        return undefined;
    } else if (result.status > 300) {
        return "error";
    }

    result = await result.text();

    result = makeSearchScreenResults(JSON.parse(result));

    return mergeResults(exactMatch, result);
}

/**
 * Functie die alle overige attributen ophaalt van het object.
 * De front end gebruikt deze functie voor het clicked resultaat scherm
 * @param clickedRes
 * @returns {Promise<void>}
 */
export async function getAllAttribtes(clickedRes) {
    /**
     * Haal alle attributen van
     */
    let url = clickedRes.getUrl();

    let res = await queryTriply(allAttributesFromUrl(url));
    res = await res.text();
    res = JSON.parse(res);

    let nodes = res.results.bindings;

    let naam;
    let naamNl;
    let naamFries;
    let types = [];
    let overigeAttributen = [];

    /**
     * Ga langs elk attribuut en voeg deze toe aan de correct attribuut
     */
    for (let i = 0; i < nodes.length; i++) {
        let key = nodes[i].prd.value;
        let value = nodes[i].obj.value;

        if (key === "http://brt.basisregistraties.overheid.nl/def/top10nl#naam") {
            naam = value;
        } else if (key === "http://brt.basisregistraties.overheid.nl/def/top10nl#naamNL") {
            naamNl = value;
        } else if (key === "http://brt.basisregistraties.overheid.nl/def/top10nl#naamFries") {
            naamFries = value;
        } else if (key === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
            types.push((stripUrlToType(value)));
        } else {
            overigeAttributen.push({key: stripUrlToType(key), value: value});
        }
    }

    /**
     * Sorteer types van subclass naar hoofdclass
     * @type {array van types}
     */
    let indexes = [];
    for (let i = 0; i < types.length; i++) {
        let index =  getIndexOfClasses(types[i]);
        let value = seperateUpperCase(types[i]);
        indexes.push({index: index, type: value});
    }


    indexes.sort((a ,b) => {
        return a.index - b.index;
    })

    types = [];
    indexes.forEach(res => {
        types.push(res.type)
    })

    /**
     * Laad de attributen in de clicked res
     */
    clickedRes.loadInAttributes(naam, naamNl, naamFries, [indexes[0].type], overigeAttributen);
}

function seperateUpperCase(string) {
    string = string.split(/(?=[A-Z])/);
    string.forEach((res, index, arr) => {

            if (index !== 0) {
                arr[index] = arr[index].charAt(0).toLowerCase() + arr[index].slice(1)
            }
        }
    )

    return  string.join(" ");
}

function stripUrlToType(url) {
    return url.replace(/.*#/, "");
}

function makeSearchScreenResults(results) {
    results = results.results.bindings;
    let returnObject = [];

    for (let i = 0; i < results.length; i++) {
        let resultaatObj = new Resultaat(results[i].obj.value);

        queryTriply(queryForType(resultaatObj.getUrl())).then(async (resOr) => {
            resOr = await resOr.text();

            resOr = JSON.parse(resOr);
            resOr = resOr.results.bindings;

            if (resOr.length !== 0) {
                let res = resOr[0];

                let naamPlaats;
                let type;
                let geojson;

                if (res.naam) {
                    naamPlaats = res.naam.value;
                } else if (res.naamNl) {
                    naamPlaats = res.naamNl.value;
                } else if (res.naamFries) {
                    naamPlaats = res.naamFries.value;
                } else {
                    console.log(res);
                    console.log(resultaatObj);
                    throw Error("No name");
                }

                if (res.type !== undefined) {
                    let indexes = [];

                    for (let j = 0; j < resOr.length; j++) {
                        let value = stripUrlToType(resOr[j].type.value);
                        let index =  getIndexOfClasses(value);
                        indexes.push({index: index, type: value});
                    }

                    indexes.sort((a ,b) => {
                        return a.index - b.index;
                    })


                    let value = indexes[0].type;
                    type = seperateUpperCase(value);
                }

                if (res.wktJson !== undefined) {
                    let wktJson = res.wktJson.value;
                    geojson = wellKnown.parse(wktJson);
                }

                resultaatObj.setSecondProperties(naamPlaats, type, geojson);

            } else {
                console.log("error: ", resOr, resultaatObj);
            }

        });

        returnObject.push(resultaatObj);
    }

    return returnObject;
}

function firstLetterCapital(text) {
    return text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

function mergeResults(exact, regex) {
    exact.forEach(resexact => {
            regex = regex.filter(resregex => {
                return resexact.getUrl() !== resregex.getUrl();
            });
        }
    );

    return exact.concat(regex);
}

async function queryTriply(query) {
    let result = await fetch("https://api.kadaster.triply.cc/datasets/kadaster/brt/services/brt/sparql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });

    return result;
}

async function queryPDOK(query) {
    let result = await fetch("https://data.pdok.nl/sparql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });

    return result;
}

function nameQueryExactMatch(query) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            
            SELECT distinct * WHERE {
              {?obj brt:naamNL "${query}".} union {?obj brt:naam "${query}".} union {?obj brt:Fries "${query}".}
            }
`
}

function nameQueryExactMatchPDOK(query) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            
            SELECT distinct * WHERE {
              {?obj brt:naamNL "${query}"@nl.} union {?obj brt:naam "${query}"@nl.} union {?obj brt:Fries "${query}"@fy.}
            }
`
}

function nameQueryForRegexMatch(queryString) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            
            SELECT distinct ?obj WHERE {
            { ?obj brt:naam ?label } UNION { ?obj brt:naamNL ?label } UNION {?obj brt:naamFries ?label}.
              
              FILTER(REGEX(?label, "${queryString}", "i") || REGEX(?naamNl, "${queryString}", "i") || REGEX(?naamFries, "${queryString}", "i")).
            }
            LIMIT 31
            `
}

function queryForType(queryString) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            PREFIX geo: <http://www.opengis.net/ont/geosparql#>

            SELECT distinct * WHERE {
               <${queryString}> a ?type
             
              Optional{<${queryString}> brt:naam ?naam.}.
              Optional{<${queryString}> brt:naamNL ?naamNl.}.
              Optional{<${queryString}> brt:naamFries ?naamFries}.
              Optional{<${queryString}> geo:hasGeometry/geo:asWKT ?wktJson}.                
            }`
}

function allAttributesFromUrl(namedNode) {
    return `PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

            SELECT * WHERE {
                <${namedNode}> ?prd ?obj.
            }`
}
