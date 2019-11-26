import Resultaat from "../../model/Resultaat";
import * as wellKnown from "wellknown";
import * as PreProcessor from "../ProcessorMethods";
import {sortByGeoMetryAndName} from "../ProcessorMethods";

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
    exactMatch = await makeSearchScreenResults(JSON.parse(exactMatch));

    return exactMatch;
}

async function makeSearchScreenResults(results) {
    results = results.results.bindings;
    let returnObject = [];

    let string = "";
    for (let i = 0; i < results.length; i++) {
        string += `<${results[i].sub.value}>`;
    }

    let res = await queryTriply(queryBetterForType(string));

    //als de gebruiker iets nieuws heeft ingetypt geef dan undefined terug.
    if (res.status > 300) {
        //bij een network error de string error
        return "error";
    }

    res = await res.text();
    res = JSON.parse(res);
    res = res.results.bindings;

    let map = new Map();

    for (let i = 0; i < res.length; i++) {
        let value = res[i].s.value;

        if (map.has(value)) {
            map.get(value).push(res[i]);
        } else {
            map.set(value, [res[i]]);
        }
    }


    map.forEach((valueMap, key, map) => {
        let naam, type, geoJson, color, objectClass;

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
    let result = await fetch("https://api.labs.kadaster.nl/datasets/kadaster/brt/services/brt/sparql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });

    return result;
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
            }
            limit 200
            `
}