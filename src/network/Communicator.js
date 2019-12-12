import * as CommunicatorSPARQL from './Communicators/CommunicatorSPARQL';
import * as ClickedCommunicator from './Communicators/ClickedCommunicator';
import * as CommunicatorELASTICSEARCH from "./Communicators/CommunicatorELASTICSEARCH";

const labsURL = "https://api.labs.kadaster.nl/datasets/kadaster/brt/services/brt/sparql";
const pdokURL = "https://data.pdok.nl/sparql";

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
        { value: 'tsp', text: 'Kadaster Labs SPARQL', description : "snel"},
        { value: 'psp', text: 'PDOK SPARQL', description : "meest actueel"},
        { value: 'tes', text: 'Kadaster Labs Elasticsearch', description : "snelste"},
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
        res = await CommunicatorSPARQL.getMatch(text, labsURL);
    }else if(method === "psp"){
        res = await CommunicatorSPARQL.getMatch(text, pdokURL);
    }else {
        res = await CommunicatorELASTICSEARCH.getMatch(text);
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
        await CommunicatorSPARQL.getAllAttribtes(clickedRes, labsURL);
    }else if(latestMethod === "psp"){
        await CommunicatorSPARQL.getAllAttribtes(clickedRes, pdokURL);
    }else {
        await CommunicatorSPARQL.getAllAttribtes(clickedRes, labsURL);
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