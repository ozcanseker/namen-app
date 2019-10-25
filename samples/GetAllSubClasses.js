/**
 * Deze file haalt alle classen en subclassen uit de brt op en zet deze op volgorde.
 * Print een array.
 * @type {{Headers?: Headers, FetchError?, Request?: Request, Response?: Response}|fetch}
 */
const fetch = require('node-fetch');

run();

async function run(){
    let classes = [];

    let results = await queryPDOK(queryForSubclassOne());
    results = await results.text();
    results = JSON.parse(results);

    results = results.results.bindings;
    let subClassesArray = [];


    for (let i = 0; i < results.length; i++) {
        let value = results[i].obj.value;
        subClassesArray.push(value);

        let results2 = await queryPDOK(querySubSubClass(value));
        results2 = await results2.text();
        results2 = JSON.parse(results2);
        results2 = results2.results.bindings;
        let subsubClasses = [];
        let overige;

        for (let j = 0; j < results2.length; j++) {
            let value = results2[j].obj.value;
            if(value.toLowerCase().includes("overig_")){
                overige = value;
            }else{
                subsubClasses.push(results2[j].obj.value);
            }
        }

        if(overige){
            subsubClasses.push(overige);
        }

        classes = classes.concat(subsubClasses);
        console.log(JSON.stringify(classes));
        console.log(classes.length);
    }

    /**
     * Voeg de sub classes als laatste toe
     * @type {*[]}
     */
    classes = classes.concat(subClassesArray);

    for (let i = 0; i < classes.length; i++) {
        classes[i] = stripUrlToType(classes[i]);
    }

}

function stripUrlToType(url) {
    return url.replace(/.*#/, "");
}

async function queryPDOK(query) {
    return await fetch("https://data.pdok.nl/sparql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    });
}

function queryForSubclassOne(){
    return `PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT * WHERE {
                ?obj rdfs:subClassOf brt:_Top10nlObject .
            }`
}

function querySubSubClass(subClass){
    return `PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT * WHERE {
                ?obj rdfs:subClassOf <${subClass}> .
            }`
}