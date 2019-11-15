import * as CommunicatorPDOK from './Communicators/CommunicatorPDOK';
import * as CommunicatorTRIPLY from './Communicators/CommunicatorTRIPLY';
import * as ClickedCommunicator from './Communicators/ClickedCommunicator';

let latestString = "";
let latestMethod = "";

export function getOptions(){
    return [
        //{ value: 'tes', text: 'Kadaster Labs Elasticsearch', description : "snelste"},
        { value: 'tsp', text: 'Kadaster Labs SPARQL', description : "snel"},
        { value: 'psp', text: 'PDOK SPARQL', description : "meest actueel"},
    ];
}

export async function getMatch(text, method) {
    latestString = text;
    latestMethod = method;
    let res;

    if(method === "tsp"){
        res = await CommunicatorTRIPLY.getMatch(text);
    }else if(method === "psp"){
        res = await CommunicatorPDOK.getMatch(text);
    }else {
        res = await CommunicatorTRIPLY.getMatch(text);
    }

    if((text === latestString && latestMethod === method) || res === "error"){
        return res;
    }else{
        return undefined;
    }
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
    if(latestMethod === "tsp"){
        await CommunicatorTRIPLY.getAllAttribtes(clickedRes);
    }else if(latestMethod === "psp"){
        await CommunicatorPDOK.getAllAttribtes(clickedRes);
    }else {
        await CommunicatorTRIPLY.getAllAttribtes(clickedRes);
    }
}

export async function getFromCoordinates(lat, long, top, left, bottom, right){
    latestString = undefined;
    latestMethod = "tsp";

    let res = await ClickedCommunicator.getFromCoordinates(lat, long, top, left, bottom, right);

    if(latestString === undefined){
        return res;
    }else {
        return undefined;
    }
}