import ResultScreenResultaat from "../model/ResultScreenResultaat";

let latestString = "";

export async function getMatch(text) {
    latestString = text;

    let result = await queryTriply(nameQueryForRegexMatch(text));

    if (latestString !== text) {
        return undefined;
    } else if (result.status > 300) {
        return "error";
    }

    result = await result.text();
    return makeSearchScreenResults(JSON.parse(result));
}

function makeSearchScreenResults(results) {
    results = results.results.bindings;
    let returnObject = [];

    for (let i = 0; i < results.length; i++) {
        let naam = new ResultScreenResultaat(results[i].obj.value);


        queryTriply(queryForType(naam.getUrl())).then(async (res) => {
            res = await res.text();

            res = JSON.parse(res);
            res = res.results.bindings;

            if (res.length !== 0) {
                res = res[res.length - 1];

                if (res.naam) {
                    naam.setNaam(res.naam.value);
                } else if (res.naamNl) {
                    naam.setNaam(res.naamNl.value);
                } else if (res.naamFries) {
                    naam.setNaam(res.naamFries.value);
                } else {
                    console.log(res);
                    console.log(naam);
                    throw Error("No name");
                }

                if(res.type !== undefined){
                    res = res.type.value;
                    res = res.replace(/.*#/, "");
                    naam.setType(res);
                }

            } else {
                console.log("error: ", res, naam);
            }

        });

        returnObject.push(naam);
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

function nameQueryForRegexMatch(queryString) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            
            SELECT distinct ?obj WHERE {
            { ?obj brt:naam ?label } UNION { ?obj brt:naamNL ?label } UNION {?obj brt:naamFries ?label}.
              
              FILTER(REGEX(?label, "${queryString}", "i") || REGEX(?naamNl, "${queryString}", "i") || REGEX(?naamFries, "${queryString}", "i")).
            }
            LIMIT 20
            `
}

function queryForType(queryString) {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>

            SELECT distinct * WHERE {
               <${queryString}> a ?type
             
              Optional{<${queryString}> brt:naam ?naam.}.
              Optional{<${queryString}> brt:naamNL ?naamNl.}.
              Optional{<${queryString}> brt:naamFries ?naamFries}.  
            }`
}
