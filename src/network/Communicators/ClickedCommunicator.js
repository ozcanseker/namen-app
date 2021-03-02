import Resultaat from "../../model/Resultaat";
import * as wellKnown from "wellknown";
import * as PreProcessor from "../ProcessorMethods";
import {clusterObjects, sortByGeoMetryAndName} from "../ProcessorMethods";

/**
 * Retrieves things from the given coordinates.
 *
 * @param lat where clicked
 * @param long where clicked
 * @param top of the card frame
 * @param left of the card frame
 * @param bottom of the card frame
 * @param right van de kaart frame
 * @param setResFromOutside with this method you can transfer the results from outside the app.You must have "waiting" as the string
 * return.
 * @returns {Promise<string|[]>} or a string with "error" or "waiting".Or an array with res.Can also be undefined.
 */
export async function getFromCoordinates(lat, long, top, left, bottom, right, setResFromOutside) {
    // check if the user is zoomed out too far.Then put your own coordinates.
    if (right - left > 0.05 || top - bottom > 0.0300) {
        left = long - 0.025;
        right = long + 0.025;
        top = lat + 0.01500;
        bottom = lat - 0.01500;
    }
    //console.log(top,left,bottom,right,lat,long);
    //pick up all not streets.
    let nonstreets = await queryTriply(queryForCoordinatesNonStreets(top, left, bottom, right));
    //console.log(nonstreets);
    if (nonstreets.status > 300) {
        // in case of a network error the string error
        return "error";
    }

    //Convert these to an array with Resultaat.js
    nonstreets = await nonstreets.text();
    nonstreets = await makeSearchScreenResults(JSON.parse(nonstreets));

    //The streets are fetched in a smaller radius so do the calculations here.
    let stop = lat - 0.0022804940130103546;//((top - bottom) / 2) * factor;
    let sbottom = lat + 0.0022804940130103546;//((top - bottom) / 2) * factor;
    let sright = long + 0.0033634901046750002;//((right - left) / 2) * factor;
    let sleft = long - 0.0033634901046750002;//((right - left) / 2) * factor;

    let streets = await queryTriply(queryForCoordinatesStreets(stop, sleft, sbottom, sright));
    if (streets.status > 300) {
        // in case of a network error the string error
        return clusterObjects(nonstreets, undefined, setResFromOutside);
    }

    // Convert these to an array with Result.js
    streets = await streets.text();
    streets = await makeSearchScreenResults(JSON.parse(streets));

    //merge the results and cluster the waterways and streets.
    nonstreets = mergeResults(streets, nonstreets);
    return clusterObjects(nonstreets, undefined, setResFromOutside);
}

/**
 * Pool results by comparing the uris.
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
 * Convert the sparql json results into a Result.js array
 * @param results
 * @returns {Promise<string|[]>}
 */
async function makeSearchScreenResults(results) {
    results = results.results.bindings;
    let returnObject = [];

    //create the query
    let string = "";
    for (let i = 0; i < results.length; i++) {
        string += `<${results[i].sub.value}>`;
    }

    let res = await queryTriply(queryBetterForType(string));

    if (res.status > 300) {
        // in case of a network error, empty array
        return [];
    }

    //process query
    res = await res.text();
    res = JSON.parse(res);
    res = res.results.bindings;

    // The query ensures that the same object is returned several times.Because of this you have to collect them
    // The key for the folder is the linked data url
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
     * For any object
     */
    map.forEach((valueMap, key, map) => {
        let naam, type, geoJson, color, objectClass;

        // this sorts the results by gemeomety and then name.
        // so eg Polygon for linestring
        sortByGeoMetryAndName(valueMap);

        let fO = valueMap[0];

        //Kijk eerst of het een brug of etc naam is.
        if (fO.brugnaam || fO.tunnelnaam || fO.sluisnaam || fO.knooppuntnaam) {
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
            //anders off naam eerst
        } else if (fO.offnaam) {
            naam = fO.offnaam.value;
            //anders friese naam eerst
        } else if (fO.naamFries) {
            naam = fO.naamFries.value;
            //anders naam nl eerst
        } else if (fO.naamNl) {
            naam = fO.naamNl.value;
            //anders de gewone naam eerst
        } else if (fO.naam) {
            naam = fO.naam.value;
        }

        //krijg de type
        if (fO.type !== undefined) {
            let indexes = [];

            //Raap eerst alle types bij elkaar
            //krijg dan de stipped url en dan de meest speciefieke type
            //Dus Sporthal komt voor Gebouw want Sporthal is specefieker.
            for (let j = 0; j < valueMap.length; j++) {
                let value = PreProcessor.stripUrlToType(valueMap[j].type.value);
                let index = PreProcessor.getIndexOfClasses(value);
                indexes.push({index: index, type: value});
            }

            //sorteer daarna op of welke het meest speciefiek is.
            indexes.sort((a, b) => {
                return a.index - b.index;
            });

            //pak de meest speciefieke als type
            let value = indexes[0].type;
            type = PreProcessor.seperateUpperCase(value);

            //De minst speciefieke wordt de object klasse.
            objectClass = PreProcessor.seperateUpperCase(indexes[indexes.length - 1].type);

            //pak een kleur op basis van het type.
            color = PreProcessor.getColor(indexes[indexes.length - 1].type);
        }

        //de wkt naar geojson
        if (fO.wktJson !== undefined) {
            let wktJson = fO.wktJson.value;
            geoJson = wellKnown.parse(wktJson);
        }

        //maak een Resultaat object en push deze naar de array.
        let resultaatObj = new Resultaat(key, naam, type, geoJson, color, objectClass);
        returnObject.push(resultaatObj);
    });

    return returnObject;
}

/**
 * This is a method that querites the sparql endpoint from triply.
 * @param query stringMetQuery
 * @returns {Promise<Response>}
 */
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

/**
 * Query die heel veel values in één keer ophaalt.
 * @param values
 * @returns {string}
 */
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
  Optional{?s brt:naamOfficieel ?offnaam.}.
  Optional{?s geo:hasGeometry/geo:asWKT ?wktJson}.
  }
`
}

/**
 * Query that does not retrieve streets based on coordinates.
 * @param top
 * @param left
 * @param bottom
 * @param righ
 * @returns {string}
 */
function queryForCoordinatesNonStreets(top, left, bottom, righ) {
    return `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            prefix bif: <http://www.openlinksw.com/schemas/bif#>

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
                BIND(bif:st_geomfromtext("POLYGON ((${left} ${bottom}, ${left} ${top}, ${righ} ${top}, ${righ} ${bottom},${left} ${bottom}))") as ?yShape).
                filter(bif:st_intersects(?xShape, ?yShape))
                
                
                filter not exists{
                    ?sub a brt:Wegdeel
                }
            }
            limit 300
            `
}

/**
 * Query that retrieves streets based on coordinates.
 * @param top
 * @param left
 * @param bottom
 * @param righ
 * @returns {string}
 */
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
                BIND(bif:st_geomfromtext("POLYGON ((${left} ${bottom}, ${left} ${top}, ${righ} ${top}, ${righ} ${bottom},${righ} ${bottom}))") as ?yShape).
                filter(bif:st_intersects(?xShape, ?yShape))
                
            }
            limit 150
            `
}