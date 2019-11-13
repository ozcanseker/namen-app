import Resultaat from "../../model/Resultaat";
import * as wellKnown from 'wellknown';
import * as PreProcessor from "../ProcessorMethods";

/**
 * Dit is het laatst ingetype string. zorgt ervoor dat je niet vorige resultaten rendert
 * @type {string}
 */
let latestString = "";

/**
 * Vind een match. Dit zoekt op exact en contains.
 * Als je het opnieuw wilt implementeren moet deze er in blijven.
 * Je zal een string krijgen die door de gebruiker ingetypte search query bevat.
 *
 * @param text de geschreven text.
 * @returns {Promise<string|undefined>} Undefined wanneer de fetch request veroudert is en een array met Resultaat.js als
 * de query nog niet veroudert is, Kan ook de string "error" terug krijgen. Dit is wanneer er een netwerk error is.
 */
export async function getMatch(text) {
    //update eerst de laatst ingetype string
    latestString = text;

    //doe hierna 2 queries. Eentje voor exacte match
    let exactMatch = await queryTriply(nameQueryExactMatch(PreProcessor.firstLetterCapital(text)));

    //als de gebruiker iets nieuws heeft ingetypt geef dan undefined terug.
    if (latestString !== text) {
        return undefined;
    } else if (exactMatch.status > 300) {
        //bij een network error de string error
        return "error";
    }

    //zet deze om in een array met Resultaat.js
    exactMatch = await exactMatch.text();
    exactMatch = makeSearchScreenResults(JSON.parse(exactMatch));

    //Doe hierna nog een query voor dingen die op de ingetypte string lijken.
    let result = await queryTriply(nameQueryForRegexMatch(text));

    if (latestString !== text) {
        return undefined;
    } else if (result.status > 300) {
        return "error";
    }

    //zet netwerk res om in een array met Resultaat.js
    result = await result.text();
    result = makeSearchScreenResults(JSON.parse(result));

    //voeg de arrays samen.
    return mergeResults(exactMatch, result);
}

/**
 * Functie die alle overige attributen ophaalt van het object.
 * De front end gebruikt deze functie voor het clicked resultaat scherm.
 *
 * Deze moet erin blijven als je het opnieuw wilt implmenteren.
 *
 * @param clickedRes een ClickedResultaat.js object die leeg is.
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
    let naamOfficieel;
    let types = [];
    let overigeAttributen = [];
    let burgNaam;
    let tunnelNaam;
    let knoopPuntNaam;
    let sluisNaam;

    /**
     * Ga langs elk attribuut en voeg deze toe aan de correct attribuut
     */
    for (let i = 0; i < nodes.length; i++) {
        let key = PreProcessor.stripUrlToType(nodes[i].prd.value);
        let value = nodes[i].obj.value;

        if (key === "naam") {
            naam = value;
        }else if( key === "brugnaam"){
            value = value.replace(/\|/g, "");
            burgNaam = value;
        } else if(key === "tunnelnaam"){
            value = value.replace(/\|/g, "");
            tunnelNaam = value;
        }else if( key === "sluisnaam" ){
            value = value.replace(/\|/g, "");
            sluisNaam = value;
        }else if( key === "knooppuntnaam"){
            value = value.replace(/\|/g, "");
            knoopPuntNaam = value;
        } else if (key === "naamNL") {
            naamNl = value;
        } else if (key === "naamFries") {
            naamFries = value;
        } else if (key === "type") {
            types.push((PreProcessor.stripUrlToType(value)));
        } else if (key === "naamOfficieel") {
            naamOfficieel = value.replace(/\|/g, "");
        } else {
            let formattedKey;

            if(key === "isBAGwoonplaats"){
                formattedKey = "BAG-woonplaats";
            }else{
                formattedKey = PreProcessor.seperateUpperCase(key)
            }

            if (key === "soortnaam" || key === "isBAGwoonplaats" || key === "bebouwdeKom" || key === "aantalinwoners" || key === "getijdeinvloed"
                || key === "hoofdafwatering" || key === "isBAGnaam" || key === "elektrificatie" || key === "gescheidenRijbaan") {

                if (key !== "aantalinwoners" && key !== "soortnaam") {
                    value = PreProcessor.veranderNaarJaNee(value);
                }
                overigeAttributen.unshift({key: (formattedKey), value: value});
            } else {
                overigeAttributen.push({key: (formattedKey), value: value});
            }
        }
    }

    /**
     * Sorteer types van subclass naar hoofdclass
     * @type {array van types}
     */
    let indexes = [];
    for (let i = 0; i < types.length; i++) {
        let index = PreProcessor.getIndexOfClasses(types[i]);
        let value = PreProcessor.seperateUpperCase(types[i]);
        indexes.push({index: index, type: value});
    }

    indexes.sort((a, b) => {
        return a.index - b.index;
    });

    /**
     * Laad de attributen in de clicked res
     */
    clickedRes.loadInAttributes(
        naam,
        naamOfficieel,
        naamNl,
        naamFries,
        [indexes[0].type],
        overigeAttributen,
        burgNaam,
        tunnelNaam,
        sluisNaam,
        knoopPuntNaam);
}

/**
 * maakt van een lijst van Result.js objecten uit de sparql query.
 * @param results
 * @returns {[]}
 */
function makeSearchScreenResults(results) {
    results = results.results.bindings;
    let returnObject = [];

    for (let i = 0; i < results.length; i++) {
        //krijg eerst de uri.
        let resultaatObj = new Resultaat(results[i].obj.value);

        //hierna query specifiek op deze uri
        queryTriply(queryForType(resultaatObj.getUrl())).then(async (resOr) => {
            resOr = await resOr.text();

            resOr = JSON.parse(resOr);
            resOr = resOr.results.bindings;

            //als er resultaten zijn
            if (resOr.length !== 0) {
                let res = resOr[0];

                let naamPlaats;
                let type;
                let geojson;
                let color;

                if((res.brugnaam && res.brugnaam.value.toUpperCase().includes(latestString.toUpperCase()))
                    || (res.tunnelnaam && res.tunnelnaam.value.toUpperCase().includes(latestString.toUpperCase()))
                    || (res.sluisnaam && res.sluisnaam.value.toUpperCase().includes(latestString.toUpperCase()))
                    || (res.knooppuntnaam && res.knooppuntnaam.value.toUpperCase().includes(latestString.toUpperCase()))
                ){
                    if(res.brugnaam){
                        naamPlaats = res.brugnaam.value;
                    }else if(res.tunnelnaam){
                        naamPlaats = res.tunnelnaam.value;
                    }else if(res.sluisnaam){
                        naamPlaats = res.sluisnaam.value;
                    }else{
                        naamPlaats = res.knooppuntnaam.value;
                    }

                    naamPlaats = naamPlaats.replace(/\|/g, "");
                }else if (res.naamFries && res.naamFries.value.toUpperCase().includes(latestString.toUpperCase())) {
                    //kijk of het resultaat niet undefined is. Kijk ook of het gezochte string een deel van de naam bevat.
                    //Dit heb je nodig want bijvoorbeeld bij frieze namen moet de applicatie de frieze naam laten zien.
                    naamPlaats = res.naamFries.value;
                } else if (res.naamNl && res.naamNl.value.toUpperCase().includes(latestString.toUpperCase())) {
                    naamPlaats = res.naamNl.value;
                } else if (res.naam && res.naam.value.toUpperCase().includes(latestString.toUpperCase())) {
                    naamPlaats = res.naam.value;
                } else {
                    if (res.naam) {
                        naamPlaats = res.naam.value;
                    } else if (res.naamNl) {
                        naamPlaats = res.naamNl.value;
                    } else if (res.naamFries) {
                        naamPlaats = res.naamFries.value;
                    }
                }

                //krijg de type
                if (res.type !== undefined) {
                    let indexes = [];

                    //sorteer dit op basis van relevantie.
                    for (let j = 0; j < resOr.length; j++) {
                        let value = PreProcessor.stripUrlToType(resOr[j].type.value);
                        let index = PreProcessor.getIndexOfClasses(value);
                        indexes.push({index: index, type: value});
                    }

                    indexes.sort((a, b) => {
                        return a.index - b.index;
                    });

                    let value = indexes[0].type;
                    type = PreProcessor.seperateUpperCase(value);

                    color = PreProcessor.getColor(indexes[indexes.length - 1].type);
                }

                //de wkt naar geojson
                if (res.wktJson !== undefined) {
                    let wktJson = res.wktJson.value;
                    geojson = wellKnown.parse(wktJson);
                }

                //zet secundaire properties/
                resultaatObj.setSecondProperties(naamPlaats, type, geojson, color);
            } else {
                console.log("error: ", resOr, resultaatObj);
            }

        });

        returnObject.push(resultaatObj);
    }

    return returnObject;
}

/**
 * Voeg resultaten samen
 * @param exact
 * @param regex
 * @returns {any[] | string}
 */
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
    return await fetch("https://api.kadaster.triply.cc/datasets/kadaster/brt/services/brt/sparql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });
}

function nameQueryExactMatch(query) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            
            SELECT distinct * WHERE {
              {?obj brt:naamNL "${query}".} union {?obj brt:naam "${query}".} union {?obj brt:naamFries "${query}".} UNION {?obj brt:brugnaam "|${query}|"}  UNION {?obj brt:tunnelnaam "|${query}|"} UNION {?obj brt:sluisnaam "|${query}|"} UNION {?obj brt:knooppuntnaam "|${query}|"} UNION {?obj brt:naamOfficieel  "|${query}|"}.
            }
            LIMIT 990
`
}

function nameQueryForRegexMatch(queryString) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            
            SELECT distinct ?obj WHERE {
            { ?obj brt:naam ?label } UNION { ?obj brt:naamNL ?label } UNION {?obj brt:naamFries ?label} UNION {?obj brt:brugnaam ?label}  UNION {?obj brt:tunnelnaam ?label} UNION {?obj brt:sluisnaam ?label} UNION {?obj brt:knooppuntnaam ?label} UNION {?obj brt:naamOfficieel ?label}.
              
              FILTER(REGEX(?label, "${queryString}", "i")).
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
              Optional{<${queryString}> brt:knooppuntnaam ?knooppuntnaam.}.
              Optional{<${queryString}> brt:sluisnaam ?sluisnaam.}.
              Optional{<${queryString}> brt:tunnelnaam ?tunnelnaam}.
              Optional{<${queryString}> brt:brugnaam ?brugnaam.}.
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
