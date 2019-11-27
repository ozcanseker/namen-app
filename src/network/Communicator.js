import * as CommunicatorPDOK from './Communicators/CommunicatorPDOK';
import * as CommunicatorTRIPLY from './Communicators/CommunicatorTRIPLY';
import * as ClickedCommunicator from './Communicators/ClickedCommunicator';

/**
 * Laatste string waar op is gezocht
 * @type {string}
 */
let latestString = "";

/**
 * Laatste methode waarop is gezocht
 * @type {string}
 */
let latestMethod = "";

/**
 * Geeft de options voor backends terug
 * @returns {({description: string, text: string, value: string}|{description: string, text: string, value: string})[]}
 */
export function getOptions(){
    return [
        //{ value: 'tes', text: 'Kadaster Labs Elasticsearch', description : "snelste"},
        { value: 'tsp', text: 'Kadaster Labs SPARQL', description : "snel"},
        { value: 'psp', text: 'PDOK SPARQL', description : "meest actueel"},
    ];
}

/**
 * Deze wordt aangeroepen wanneer de gebruiker iets in het zoekveld typt
 *
 * @param text: gezochte tekst
 * @param method:  de methode waarmee is gezocht
 * @returns {Promise<string|undefined>}
 */
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
 * @returns {Promise<void>} verwacht niets terug maar moet wel de clickedRes vullen met de loadInAttributes van de ClickedRes.js
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

/**
 * Deze functie wordt aangeroepen wanneer de gebruiker
 *
 * @param lat
 * @param long
 * @param top
 * @param left
 * @param bottom
 * @param right
 * @returns {Promise<string|*[]|undefined>} Verwacht een lijst met Resultaat.js objecten terug
 */
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