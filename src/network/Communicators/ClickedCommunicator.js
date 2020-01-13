import Resultaat from "../../model/Resultaat";
import * as wellKnown from "wellknown";
import * as PreProcessor from "../ProcessorMethods";
import {clusterObjects, sortByGeoMetryAndName} from "../ProcessorMethods";

/**
 * Haalt dingen op aan de hand van de gegeven coordinaten.
 *
 * @param lat waar geklikt is
 * @param long waar geklikt is
 * @param top van de kaart frame
 * @param left van de kaart frame
 * @param bottom van de kaart frame
 * @param right van de kaart frame
 * @param setResFromOutside met deze methode kan je de resultaten van buiten de app zetten. Je moet wel "waiting" als string
 * terug geven.
 * @returns {Promise<string|[]>} of een string met "error" of "waiting". Of een array met res. Kan ook undefined.
 */
export async function getFromCoordinates(lat, long, top, left, bottom, right, setResFromOutside) {
    //check of de gebruiker te ver is uitgezoomd. Zet dan je eigen coordinaten.
    if (right - left > 0.05 || top - bottom > 0.0300) {
        left = long - 0.025;
        right = long + 0.025;
        top = lat + 0.01500;
        bottom = lat - 0.01500;
    }

    //haal alle niet straten op.
    let nonstreets = await queryTriply(queryForCoordinatesNonStreets(top, left, bottom, right));

    if (nonstreets.status > 300) {
        //bij een network error de string error
        return "error";
    }

    //Zet deze om in een array met Resultaat.js
    nonstreets = await nonstreets.text();
    nonstreets = await makeSearchScreenResults(JSON.parse(nonstreets));

    //De straten worden in een kleinere straal opgehaald dus doe hier de berekeningen.
    let stop = lat - 0.0022804940130103546;//((top - bottom) / 2) * factor;
    let sbottom = lat + 0.0022804940130103546;//((top - bottom) / 2) * factor;
    let sright = long + 0.0033634901046750002;//((right - left) / 2) * factor;
    let sleft = long - 0.0033634901046750002;//((right - left) / 2) * factor;

    let streets = await queryTriply(queryForCoordinatesStreets(stop, sleft, sbottom, sright));
    if (streets.status > 300) {
        //bij een network error de string error
        return clusterObjects(nonstreets, undefined, setResFromOutside);
    }

    //Zet deze om in een array met Resultaat.js
    streets = await streets.text();
    streets = await makeSearchScreenResults(JSON.parse(streets));

    //voeg de resultaten samen en cluster de waterlopen en straten.
    nonstreets = mergeResults(streets, nonstreets);
    return clusterObjects(nonstreets, undefined, setResFromOutside);
}

/**
 * Voeg resultaten samen door de uris met elkaar te vergelijken.
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
        //bij een network error, lege array
        return [];
    }

    //verwerk de query
    res = await res.text();
    res = JSON.parse(res);
    res = res.results.bindings;

    // De query zorgt ervoor dat meerdere keren hetzelfde object wordt terug gegeven. Hierdoor moet je ze bij elkaar rapen
    // De key voor de map is de linked data url
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
        //dus bijv Polygoon voor linestring
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
 * Dit is een methode die het sparql endpoint van triply queriet.
 * @param query string met query
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
 * Query die aan de hand van coordinaten niet straten ophaalt.
 * @param top
 * @param left
 * @param bottom
 * @param righ
 * @returns {string}
 */
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

/**
 * Query die aan de hand van coordinaten straten ophaalt.
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
                BIND(bif:st_geomfromtext("POLYGON ((${left} ${bottom}, ${left} ${top}, ${righ} ${top}, ${righ} ${bottom}))") as ?yShape).
                filter(bif:st_intersects(?xShape, ?yShape))
                
            }
            limit 150
            `
}