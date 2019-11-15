import Resultaat from "../../model/Resultaat";
import * as wellKnown from "wellknown";
import * as PreProcessor from "../ProcessorMethods";

export async function getFromCoordinates(lat, long, top, left, bottom, right) {
    if (right - left > 0.05 || top - bottom > 0.0300) {
        left = long - 0.025;
        right = long + 0.025;
        top = lat + 0.01500;
        bottom = lat - 0.01500;
    }

    let exactMatch = await queryTriply(queryForCoordinates(top, left, bottom, right));

    //als de gebruiker iets nieuws heeft ingetypt geef dan undefined terug.
    if (exactMatch.status > 300) {
        //bij een network error de string error
        return "error";
    }

    //zet deze om in een array met Resultaat.js
    exactMatch = await exactMatch.text();
    exactMatch = makeSearchScreenResults(JSON.parse(exactMatch));

    if (exactMatch.length > 90) {
        return exactMatch;
    }

    // let exactMatch2 = await queryTriply(queryForCoordinates(lat + 0.0500, long - 0.017, lat - 0.0500, long + 0.017));
    //
    // if (exactMatch2.status > 300) {
    //     //bij een network error de string error
    //     return exactMatch;
    // }
    //
    // //zet deze om in een array met Resultaat.js
    // exactMatch2 = await exactMatch2.text();
    // exactMatch2 = makeSearchScreenResults(JSON.parse(exactMatch2));

    return exactMatch;
}

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

                if (res.brugnaam || res.tunnelnaam || res.sluisnaam || res.knooppuntnaam) {
                    if (res.brugnaam) {
                        naamPlaats = res.brugnaam.value;
                    } else if (res.tunnelnaam) {
                        naamPlaats = res.tunnelnaam.value;
                    } else if (res.sluisnaam) {
                        naamPlaats = res.sluisnaam.value;
                    } else {
                        naamPlaats = res.knooppuntnaam.value;
                    }

                    naamPlaats = naamPlaats.replace(/\|/g, "");
                } else if (res.naamFries) {
                    //kijk of het resultaat niet undefined is. Kijk ook of het gezochte string een deel van de naam bevat.
                    //Dit heb je nodig want bijvoorbeeld bij frieze namen moet de applicatie de frieze naam laten zien.
                    naamPlaats = res.naamFries.value;
                } else if (res.naamNl) {
                    naamPlaats = res.naamNl.value;
                } else if (res.naam) {
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
                    })


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


function queryForCoordinates(top, left, bottom, righ) {
    return `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>

            select distinct ?obj{
            {
                ?obj brt:naam ?label;
                 geo:hasGeometry/geo:asWKT ?xShape.
              } UNION {
                ?obj brt:naamNL ?label;
                     geo:hasGeometry/geo:asWKT ?xShape.
              }UNION {
                ?obj brt:naamFries ?label;
                     geo:hasGeometry/geo:asWKT ?xShape.
              }UNION {
                ?obj brt:naamOfficieel ?label;
                     geo:hasGeometry/geo:asWKT ?xShape.
              }
                BIND(bif:st_geomfromtext("POLYGON ((${left} ${bottom}, ${left} ${top}, ${righ} ${top}, ${righ} ${bottom}))") as ?yShape).
                filter(bif:st_intersects(?xShape, ?yShape))
            }
            limit 200
            `
}