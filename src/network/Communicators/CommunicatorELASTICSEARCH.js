import {clusterObjects, processSearchScreenResults} from "../ProcessorMethods";
import {queryTriply, queryBetterForType} from './CommunicatorTRIPLY';

let latestString;

export async function getMatch(text) {
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

    console.log(res);

    res = await makeSearchScreenResults(res);
    return clusterObjects(res);
}

/**
 * maakt van een lijst van Result.js objecten uit de sparql query.
 * @param results
 * @returns {[]}
 */
async function makeSearchScreenResults(results) {
    results = results.hits.hits;

    let string = "";
    for (let i = 0; i < results.length; i++) {
        string += `<${results[i]._id}>`;
    }

    let res = await queryTriply(queryBetterForType(string));

    //als de gebruiker iets nieuws heeft ingetypt geef dan undefined terug.
    if (res.status > 300) {
        //bij een network error de string error
        return "error";
    }

    res = await res.text();
    res = JSON.parse(res);

    return processSearchScreenResults(res, latestString);
}

async function queryESDLK(query) {
    return await fetch(`https://api.labs.kadaster.nl/datasets/kadaster/brt/services/search/search?query=${query}`, {
        method: 'GET'
    });
}