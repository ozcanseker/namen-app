/**
 * Dit is de class die verschillende endpoints kan bevragen. Als je maar één endpoint hebt raad ik het aan om alle logica
 * voor de communicatie hier te implementeren. De rest kan je verwijderen.
 */
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
 * Laatste methode waarmee is gezocht
 * @type {string}
 */
let latestMethod = "";

/**
 * Geeft de options voor backends terug, als er maar één optie wordt meegegeven wordt de tandwiel linksonder niet meer getoond.
 * @returns {[{description: string, text: string, value: string}]}
 */
export function getOptions() {
    return [
        {value: 'tsp', text: 'Kadaster Labs SPARQL', description: "snel"},
        {value: 'psp', text: 'PDOK SPARQL', description: "meest actueel"},
        {value: 'tes', text: 'Kadaster Labs Elasticsearch', description: "snelste"},
    ];
}

/**
 * Deze wordt aangeroepen wanneer de gebruiker iets in het zoekveld typt
 *
 * @param text: gezochte tekst
 * @param method: de methode waarmee is gezocht
 * @param setResFromOutside methode om vanaf de buitenkant de resultaat te zetten.
 * @returns {Promise<string|undefined>}
 */
export async function getMatch(text, method, setResFromOutside) {
    latestString = text;
    latestMethod = method;
    let res;

    //query op basis van de methode die de gebruiker gespecificeerd heeft.
    if (method === "tsp") {
        res = await CommunicatorSPARQL.getMatch(text, labsURL, setResFromOutside);
    } else if (method === "psp") {
        res = await CommunicatorSPARQL.getMatch(text, pdokURL, setResFromOutside);
    } else {
        res = await CommunicatorELASTICSEARCH.getMatch(text, labsURL, setResFromOutside);
    }

    //als het of een error is en als de laatste methode en gezochte string overeenkomen. geef dan het resultaat terug.
    if ((text === latestString && latestMethod === method) || res === "error") {
        return res;
    } else {
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
    if (latestMethod === "tsp") {
        await CommunicatorSPARQL.getAllAttribtes(clickedRes, labsURL);
    } else if (latestMethod === "psp") {
        await CommunicatorSPARQL.getAllAttribtes(clickedRes, pdokURL);
    } else {
        await CommunicatorSPARQL.getAllAttribtes(clickedRes, labsURL);
    }
}

/**
 * Deze functie wordt aangeroepen wanneer de gebruiker recht klikt op de kaart.
 *
 * @param lat de latitude van het geklikt punt
 * @param long de longitude van het geklikt punt
 * @param top van het kaart scherm
 * @param left van het kaart scherm
 * @param bottom van het kaart scherm
 * @param right van het kaart scherm
 * @returns {Promise<string|*[]|undefined>} Verwacht een lijst met Resultaat.js objecten terug
 */
export async function getFromCoordinates(lat, long, top, left, bottom, right, setResFromOutside) {
    latestString = undefined;
    latestMethod = "tsp";

    let res = await ClickedCommunicator.getFromCoordinates(lat, long, top, left, bottom, right, setResFromOutside);

    //als de gebruiker iets anders heeft opgezocht geef dan undefined terug.
    if (latestString === undefined) {
        return res;
    } else {
        return undefined;
    }
}