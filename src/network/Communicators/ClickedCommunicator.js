import Resultaat from "../../model/Resultaat";
import * as wellKnown from "wellknown";
import * as PreProcessor from "../ProcessorMethods";
import {clusterObjects, sortByGeoMetryAndName} from "../ProcessorMethods";

/**
 * Haalt dingen op aan de hand van de gegeven coordinaten.
 * @param lat
 * @param long
 * @param top
 * @param left
 * @param bottom
 * @param right
 * @returns {Promise<string|[]>}
 */
export async function getFromCoordinates(lat, long, top, left, bottom, right) {
    if (right - left > 0.05 || top - bottom > 0.0300) {
        left = long - 0.025;
        right = long + 0.025;
        top = lat + 0.01500;
        bottom = lat - 0.01500;
    }

    let factor = 0.33;

    let stop = lat - ((top-bottom)/2) * factor;
    let sbottom = lat + ((top-bottom)/2) * factor;
    let sright = long + ((right-left)/2) * factor;
    let sleft = long - ((right-left)/2) * factor;

    let nonstreets = await queryTriply(queryForCoordinatesNonStreets(top, left, bottom, right));

    if (nonstreets.status > 300) {
        //bij een network error de string error
        return "error";
    }

    //Zet deze om in een array met Resultaat.js
    nonstreets = await nonstreets.text();
    nonstreets = await makeSearchScreenResults(JSON.parse(nonstreets));

    let streets = await queryTriply(queryForCoordinatesStreets(stop, sleft, sbottom, sright));
    if (streets.status > 300) {
        //bij een network error de string error
        return clusterObjects(nonstreets);
    }

    //Zet deze om in een array met Resultaat.js
    streets = await streets.text();
    streets = await makeSearchScreenResults(JSON.parse(streets));

    nonstreets = mergeResults(streets, nonstreets);
    return clusterObjects(nonstreets);
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

/**
 * Zet de sparql json resulaten om in een Resultaat.js array
 * @param results
 * @returns {Promise<string|[]>}
 */
async function makeSearchScreenResults(results) {
    results = results.results.bindings;
    let returnObject = [];

    //maak de query
    let string = "";
    for (let i = 0; i < results.length; i++) {
        string += `<${results[i].sub.value}>`;
    }

    let res = await queryTriply(queryBetterForType(string));

    if (res.status > 300) {
        //bij een network error de string error
        return "error";
    }

    //verwerk de query
    res = await res.text();
    res = JSON.parse(res);
    res = res.results.bindings;

    // de query zorgt ervoor dat meerdere keren hetzelfde object wordt terug gegeven. Hierdoor moet je ze bij elkaar rapen
    //De key voor de map is de linked data url
    let map = new Map();

    for (let i = 0; i < res.length; i++) {
        let value = res[i].s.value;

        if (map.has(value)) {
            map.get(value).push(res[i]);
        } else {
            map.set(value, [res[i]]);
        }
    }

    /**
     * Voor elke object
     */
    map.forEach((valueMap, key, map) => {
        let naam, type, geoJson, color, objectClass;

        //dit sorteert de resultaten op gemeomety en dan naam.
        //dus groot eerst
        sortByGeoMetryAndName(valueMap);

        let fO = valueMap[0];

        if (fO.brugnaam || fO.tunnelnaam || fO.sluisnaam || fO.knooppuntnaam) {
            //staat zo want de naam moet verandert worden.
            if (fO.brugnaam) {
                naam = fO.brugnaam.value;
            } else if (fO.tunnelnaam) {
                naam = fO.tunnelnaam.value;
            } else if (fO.sluisnaam) {
                naam = fO.sluisnaam.value;
            } else {
                naam = fO.knooppuntnaam.value;
            }

            naam = naam.replace(/\|/g, "");
        } else if (fO.naamFries) {
            //kijk of het resultaat niet undefined is. Kijk ook of het gezochte string een deel van de naam bevat.
            //Dit heb je nodig want bijvoorbeeld bij frieze namen moet de applicatie de frieze naam laten zien.
            naam = fO.naamFries.value;
        } else if (fO.naamNl) {
            naam = fO.naamNl.value;
        } else if (fO.naam) {
            naam = fO.naam.value;
        }

        //krijg de type
        if (fO.type !== undefined) {
            let indexes = [];

            //sorteer dit op basis van relevantie.
            for (let j = 0; j < valueMap.length; j++) {
                let value = PreProcessor.stripUrlToType(valueMap[j].type.value);
                let index = PreProcessor.getIndexOfClasses(value);
                indexes.push({index: index, type: value});
            }

            indexes.sort((a, b) => {
                return a.index - b.index;
            });

            let value = indexes[0].type;
            type = PreProcessor.seperateUpperCase(value);
            objectClass = PreProcessor.seperateUpperCase(indexes[indexes.length - 1].type);

            color = PreProcessor.getColor(indexes[indexes.length - 1].type);
        }

        //de wkt naar geojson
        if (fO.wktJson !== undefined) {
            let wktJson = fO.wktJson.value;
            geoJson = wellKnown.parse(wktJson);
        }

        let resultaatObj = new Resultaat(key, naam, type, geoJson, color, objectClass);
        returnObject.push(resultaatObj);
    });

    return returnObject;
}

async function queryTriply(query) {
    return await fetch("https://api.labs.kadaster.nl/datasets/kadaster/brt/services/brt/sparql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });
}

function queryBetterForType(values) {
    return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    
    SELECT * WHERE {
        VALUES ?s {
           ${values}
        }
        ?s a ?type
        
  Optional{?s brt:naam ?naam.}.
  Optional{?s brt:naamNL ?naamNl.}.
  Optional{?s brt:naamFries ?naamFries}.
  Optional{?s brt:knooppuntnaam ?knooppuntnaam.}.
  Optional{?s brt:sluisnaam ?sluisnaam.}.
  Optional{?s brt:tunnelnaam ?tunnelnaam}.
  Optional{?s brt:brugnaam ?brugnaam.}.
  Optional{?s geo:hasGeometry/geo:asWKT ?wktJson}.
  }
`
}

function queryForCoordinatesNonStreets(top, left, bottom, righ) {
    return `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>

            select distinct ?sub{
            {
                ?sub brt:naam ?label;
                 geo:hasGeometry/geo:asWKT ?xShape.
              } UNION {
                ?sub brt:naamNL ?label;
                     geo:hasGeometry/geo:asWKT ?xShape.
              }UNION {
                ?sub brt:naamFries ?label;
                     geo:hasGeometry/geo:asWKT ?xShape.
              }UNION {
                ?sub brt:naamOfficieel ?label;
                     geo:hasGeometry/geo:asWKT ?xShape.
              }
                BIND(bif:st_geomfromtext("POLYGON ((${left} ${bottom}, ${left} ${top}, ${righ} ${top}, ${righ} ${bottom}))") as ?yShape).
                filter(bif:st_intersects(?xShape, ?yShape))
                filter not exists{
                    ?sub a brt:Wegdeel
                }
            }
            limit 300
            `
}

function queryForCoordinatesStreets(top, left, bottom, righ) {
    return `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>

            select distinct ?sub{
            {
                ?sub brt:naam ?label;
                 geo:hasGeometry/geo:asWKT ?xShape;
                     a brt:Wegdeel.
              } UNION {
                ?sub brt:naamNL ?label;
                     geo:hasGeometry/geo:asWKT ?xShape;
                     a brt:Wegdeel.
              }UNION {
                ?sub brt:naamFries ?label;
                     geo:hasGeometry/geo:asWKT ?xShape;
                     a brt:Wegdeel.
              }UNION {
                ?sub brt:naamOfficieel ?label;
                     geo:hasGeometry/geo:asWKT ?xShape;
                     a brt:Wegdeel.
              }
                BIND(bif:st_geomfromtext("POLYGON ((${left} ${bottom}, ${left} ${top}, ${righ} ${top}, ${righ} ${bottom}))") as ?yShape).
                filter(bif:st_intersects(?xShape, ?yShape))
                
            }
            limit 150
            `
}