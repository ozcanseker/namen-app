import {clusterObjects, processSearchScreenResults} from "../ProcessorMethods";
import {queryEndpoint, queryBetterForType} from './CommunicatorSPARQL';

let latestString;

export async function getMatch(text,labsURL ,setResFromOutside) {
    //update eerst de laatst ingetype string
    latestString = text;

    let res = await queryESDLK(text);

    //als de gebruiker iets nieuws heeft ingetypt geef dan undefined terug.
    if (latestString !== text) {
        return undefined;
    } else if (res.status > 300) {
        //bij een network error de string error
        return "error";
    }

    res = await res.text();
    res = JSON.parse(res);

    res = await makeSearchScreenResults(res, labsURL);
    return clusterObjects(res, text, setResFromOutside);
}

/**
 * maakt van een lijst van Result.js objecten uit de sparql query.
 * @param results
 * @param labsURL url van data.labs.kadaster.nl voor het sparql endpoint
 * @returns {[]}
 */
async function makeSearchScreenResults(results, labsURL) {
    results = results.hits.hits;

    if(results.length === 0){
        return [];
    }

    let string = "";
    for (let i = 0; i < results.length; i++) {
        string += `<${results[i]._id}>`;
    }

    let res = await queryEndpoint(queryBetterForType(string), labsURL);

    //bij een network error
    if (res.status > 300) {
        return [];
    }

    res = await res.text();
    res = JSON.parse(res);

    return processSearchScreenResults(res, latestString);
}

/**
 * Queriet de data.labs.kadaster.nl elastic search endpoint.
 * @param query
 * @returns {Promise<Response>}
 */
async function queryESDLK(query) {
    return await fetch(`https://api.labs.kadaster.nl/datasets/kadaster/brt/services/search/search?query=${query}`, {
        method: 'GET'
    });
}