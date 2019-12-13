/**
 * Deze file bevat alle methodes die door meerdere communicators gebruikt worden. bijv first letter capital
 *
 * Ook bevindt zich in deze file alle "leterlijke strings" dus bijv "Gemeente" die ik niet in de front end wou zetten.
 *
 * Hierdoor blijft de front end hopelijk stabiel terwijl je deze file alleen hoeft te veranderen wil je de functionialtier veranderen.
 *
 * Hier zitten ook een aantal methodes in die door de front end worden aangeroepen.
 */

import * as wellKnown from "wellknown";
import Resultaat from "../model/Resultaat";
import * as turf from "@turf/turf";
import ClusterObject from "../model/ClusterObject";

/**
 * Een file die alle classen van de brt bevat. Object klassen staan achter aan.
 * @type {*[]}
 */
let classes = ["Grasland", "BosGemengdBos", "Akkerland", "BosNaaldbos", "Dodenakker", "BosLoofbos", "Spoorbaanlichaam", "Heide", "BebouwdGebied", "Populieren", "Boomgaard", "Boomkwekerij", "Zand", "Duin", "Fruitkwekerij", "BasaltblokkenSteenglooiing", "BosGriend", "Braakliggend", "Aanlegsteiger_terrein", "DodenakkerMetBos", "BronWel", "GreppelDrogeSloot", "Waterloop", "MeerPlas", "Droogvallend", "Droogvallend_LAT", "Zee_waterdeel", "KasWarenhuis", "Tank", "Huizenblok", "KloosterAbdij", "Zwembad_gebouw", "Sporthal", "ParkeerdakParkeerdekParkeergarage", "Gemeentehuis", "Toren", "WindmolenKorenmolen", "Gemaal", "Kapel", "Uitzichttoren", "Pompstation", "Manege", "Fort", "Rune", "Transformatorstation_gebouw", "Tankstation", "Museum", "Kasteel", "School", "Waterradmolen", "Ziekenhuis", "Postkantoor", "Bunker", "Koeltoren", "Vuurtoren", "Watertoren", "WindmolenWatermolen", "Universiteit", "RadiotorenTelevisietoren", "Bezoekerscentrum", "PsychiatrischZiekenhuisPsychiatrischCentrum", "Gevangenis", "Elektriciteitscentrale", "Politiebureau", "Radarpost", "Schaapskooi", "Lichttoren", "Werf_gebouw", "Radartoren", "Dok", "Veiling", "Fabriek", "Peilmeetstation", "Windmolen", "Schoorsteen", "Crematorium", "Stadion", "Paleis", "Kunstijsbaan", "Telecommunicatietoren", "Klokkentoren", "Zendtoren", "Brandweerkazerne", "Stationsgebouw", "MarkantGebouw", "Reddingboothuisje", "KliniekInrichtingSanatorium", "Recreatiecentrum", "Verkeerstoren", "Koepel", "KerncentraleKernreactor", "StadskantoorHulpsecretarie", "Hotel", "Remise", "Kerk", "Brandtoren", "Luchtwachttoren", "Silo", "Moskee", "OverigReligieusGebouw", "Synagoge", "MilitairGebouw", "Windturbine", "Tol_gebouw", "Boortoren", "Observatorium", "Wegrestaurant", "Bomenrij", "Koedam", "HegHaag", "Aanlegsteiger_inrichtingselement", "Hekwerk", "Wegafsluiting", "Verkeersgeleider", "Stuw", "Muur", "Geluidswering", "StrekdamKribGolfbreker", "Hoogspanningsleiding", "Sluisdeur", "Schietbaan", "Kabelbaan", "Paalwerk", "Stormvloedkering", "Tol_inrichtingselement", "Boom", "Strandpaal", "Hoogspanningsmast", "Wegwijzer", "Grenspunt", "Kruis", "Pijler", "Kilometerraaibord", "Paal", "Zendmast", "Kilometerpaal", "Windmolentje", "Dukdalf", "Peilschaal", "Scheepvaartlicht", "Botenhelling", "KilometerpaalWater", "KogelvangerSchietbaan", "GedenktekenMonument", "KilometerpaalSpoorweg", "Radiotelescoop", "MarkantObject", "Seinmast", "GpsKernnetpunt", "Kilometerraaipaal", "Klokkenstoel", "Vlampijp", "Busstation", "Oliepompinstallatie", "Hunebed", "Uitzichtpunt", "Baak", "ZichtbaarWrak", "Golfmeetpaal", "Helikopterlandingsplatform", "Kraan", "Gaswinning_inrichtingselement", "Metrostation", "Treinstation", "Sneltramhalte", "Kaap", "Havenhoofd", "Vliedberg", "Kabelbaanmast", "Plaatsnaambord", "Calamiteitendoorgang", "Leiding", "Luchtvaartlicht", "Radiobaken", "RdPunt", "Weg", "Spoor", "Water", "Wijk", "Buurtschap", "Gehucht", "Deelkern", "Buurt", "Woonkern", "Industriekern", "Recreatiekern", "Stadsdeel", "TaludHoogteverschil", "SteileRandAardrand", "Wal", "Trein", "Metro", "Tram", "Sneltram", "Gemengd", "Werf_functioneelGebied", "Park", "Gebouwencomplex", "Haven_functioneelGebied", "Natuurgebied", "Landgoed", "Infiltratiegebied", "Verdedigingswerk", "Boswachterij", "Tennispark", "Bedrijventerrein", "Eendenkooi", "Woonwagencentrum", "Transformatorstation_functioneelGebied", "Zuiveringsinstallatie", "SportterreinSportcomplex", "Begraafplaats", "Wildwissel", "Jachthaven", "Stortplaats", "Bungalowpark", "CampingKampeerterrein", "Heemtuin", "Volkstuinen", "Vakantiepark", "Sluizencomplex", "Ijsbaan", "DierentuinSafaripark", "Zenderpark", "Circuit", "Viskwekerij_functioneelGebied", "Ziekenhuiscomplex", "Verzorgingsplaats", "Openluchtmuseum", "Crossbaan", "Openluchttheater", "Waterkering", "Mosselbank", "Milieustraat", "Kassengebied", "VliegveldLuchthaven", "BotanischeTuin", "Golfterrein", "Zonnepark", "Kartingbaan", "Caravanpark", "Visvijvercomplex", "Erebegraafplaats", "KazerneLegerplaats", "MilitairOefengebiedSchietterrein", "ZwembadComplex", "Gaswinning_functioneelGebied", "Zweefvliegveldterrein", "Renbaan", "Attractiepark", "Grafheuvel", "Windturbinepark", "Tuincentrum", "Zandwinning", "Recreatiegebied", "Skibaan", "Productie-installatie", "Groeve", "Campus", "Helikopterlandingsterrein", "Zoutwinning", "GebiedVoorRadioastronomie", "NationaalPark", "Grindwinning", "Slipschool", "Emplacement", "Mijn", "Oliewinning", "Plantsoen", "Arboretum", "GebiedMetHogeObjecten", "NatuurgebiedNatuurreservaat", "Veerverbinding", "Autosnelweg", "RegionaleWeg", "Hoofdweg", "LokaleWeg", "Straat", "ParkeerplaatsCarpool", "Parkeerplaats", "RolbaanPlatform", "StartbaanLandingsbaan", "ParkeerplaatsPR", "Polder", "StreekVeld", "Bosgebied", "GeulVaargeul", "Heidegebied", "HeuvelBerg", "BankOndieptePlaat", "ZeegatZeearm", "Eiland", "KaapHoek", "Duingebied", "Zee_geografischGebied", "Wad", "TerpWierde", "Watergebied", "Hoogtepunt", "Dieptepunt", "Peil", "PeilWinterpeil", "PeilZomerpeil", "Laagwaterlijn", "Hoogtelijn", "Dieptelijn", "Hoogwaterlijn", "Gemeente", "Provincie", "Land", "TerritorialeZee", "Waterschap", "Overig_terrein", "Overig_waterdeel", "Overig_gebouw", "Overig_inrichtingselement", "Overig_planTopografie", "Overig_functioneelGebied", "Overig_wegdeel", "Overig_geografischGebied", "Terrein", "Waterdeel", "Gebouw", "Inrichtingselement", "PlanTopografie", "Plaats", "Relief", "Spoorbaandeel", "FunctioneelGebied", "Wegdeel", "GeografischGebied", "Hoogte", "RegistratiefGebied"];

/**
 * Hier kan je de index opvragen van een element in de array
 * @param className string
 * @returns {number}
 */
export function getIndexOfClasses(className) {
    return classes.indexOf(className);
}

/**
 * Een functie die de front end gebruikt om recht geklikte resultaten te filteren. Deze kan je aanpassen.
 * @param res
 * @returns {boolean}
 */
export function isShownClickedResults(res) {
    return res.getType() !== "Land" && res.getType() !== "Provincie";
}

/**
 * Dit is een functie die een kleur toewijst aan een klasse.
 * @param type
 * @returns {string|undefined}
 */
export function getColor(type) {
    switch (type) {
        case "FunctioneelGebied":
            return "green";
        case "Gebouw":
            return "red";
        case "GeografischGebied":
            return "mediumaquamarine";
        case "Hoogte":
            return undefined;
        case "Inrichtingselement":
            return "purple";
        case "Plaats":
            return "turqoise";
        case "PlanTopografie":
            return undefined;
        case "RegistratiefGebied":
            return "yellow";
        case "Spoorbaandeel":
            return "purple";
        case "Terrein":
            return "mediumaquamarine";
        case "Relief":
            return undefined;
        case "Waterdeel":
            return "blue";
        case "Wegdeel":
            return "purple";
        default:
            return undefined;
    }
}

/**
 * Wordt door de front-end gebruikt om de layering te bepalen.
 * @param list
 */
export function sortByObjectClass(list) {
    list.sort((a, b) => {
        a = a.properties;
        b = b.properties;

        if (a.getType() === "Provincie" || b.getType() === "Provincie") {
            if (a.getType() === "Provincie" && b.getType() === "Provincie") {
                return 0;
            } else if (a.getType() === "Provincie") {
                return -1;
            } else {
                return 1;
            }
        }

        if (a.getType() === "Gemeente" || b.getType() === "Gemeente") {
            if (a.getType() === "Gemeente" && b.getType() === "Gemeente") {
                return 0;
            } else if (a.getType() === "Gemeente") {
                return -1;
            } else {
                return 1;
            }
        }

        if (a.getType() === "Woonkern" || b.getType() === "Woonkern") {
            if (a.getType() === "Woonkern" && b.getType() === "Woonkern") {
                return 0;
            } else if (a.getType() === "Woonkern") {
                return -1;
            } else {
                return 1;
            }
        }

        if (a.getType() === "Stadsdeel" || b.getType() === "Stadsdeel") {
            if (a.getType() === "Stadsdeel" && b.getType() === "Stadsdeel") {
                return 0;
            } else if (a.getType() === "Stadsdeel") {
                return -1;
            } else {
                return 1;
            }
        }

        if (a.getType() === "Wijk" || b.getType() === "Wijk") {
            if (a.getType() === "Wijk" && b.getType() === "Wijk") {
                return 0;
            } else if (a.getType() === "Wijk") {
                return -1;
            } else {
                return 1;
            }
        }

        if (a.getType() === "Buurt" || b.getType() === "Buurt") {
            if (a.getType() === "Buurt" && b.getType() === "Buurt") {
                return 0;
            } else if (a.getType() === "Buurt") {
                return -1;
            } else {
                return 1;
            }
        }

        if (a.getObjectClass() === "Gebouw" || b.getObjectClass() === "Gebouw") {
            if (a.getObjectClass() === "Gebouw" && b.getObjectClass() === "Gebouw") {
                return 0;
            } else if (a.getObjectClass() === "Gebouw") {
                return 1;
            } else {
                return -1;
            }
        }

        return 0;
    })
}

/**
 * Verander elk eerste letter naar een hoofdletter
 * @param text
 * @returns {string}
 */
export function firstLetterCapital(text) {
    return text.toLowerCase()
        .split(' ')
        .map(s => {
            if (!s.startsWith("ij")) {
                return s.charAt(0).toUpperCase() + s.substring(1)
            } else {
                return s.charAt(0).toUpperCase() + s.charAt(1).toUpperCase() + s.substring(2)
            }
        })
        .join(' ');
}

/**
 * Haalt alles voor de # weg
 * @param url
 * @returns {*|void|string}
 */
export function stripUrlToType(url) {
    return url.replace(/.*#/, "");
}

/**
 * Seperate de string gebasseerd op uppercase.
 * @param string
 * @returns {string}
 */
export function seperateUpperCase(string) {
    //haal ook underscores weg
    string = string.replace("_", " ");

    string = string.split(/(?=[A-Z])/);
    string.forEach((res, index, arr) => {
            if (index !== 0) {
                arr[index] = arr[index].charAt(0).toLowerCase() + arr[index].slice(1)
            }
        }
    );

    return string.join(" ");
}

/**
 * Verandert een 1 of true naar ja. ander nee
 * @param string
 * @returns {string}
 */
export function veranderNaarJaNee(string) {
    if (string === "1" || string === "true") {
        return "ja";
    }
    return "nee";
}

/**
 * Sorteert op naam en dan geometry
 * Vooral gemaakt voor straten.
 * @param values
 * @param searchString
 */
export function sortByGeoMetryAndName(values, searchString) {
    if (searchString) {
        searchString = searchString.toUpperCase();
    }

    values.sort((a, b) => {
        //kijk eerst of de gezochte string zich bevindt in de naam
        if (a.naam && b.naam && searchString) {
            let naama = a.naam.value.toUpperCase();
            let naamb = b.naam.value.toUpperCase();

            if (naama.includes(searchString) && !naamb.includes(searchString)) {
                return -1;
            } else if (!naama.includes(searchString) && naamb.includes(searchString)) {
                return 1;
            }
        }

        //sorteer op geometry
        let aGeo = a.wktJson.value;
        let bGeo = b.wktJson.value;

        if (aGeo.startsWith("GEOMETRYCOLLECTION") || bGeo.startsWith("GEOMETRYCOLLECTION")) {
            if (aGeo.startsWith("GEOMETRYCOLLECTION")) {
                return -1;
            } else {
                return 1;
            }
        } else if (aGeo.startsWith("MULTIPOLYGON") || bGeo.startsWith("MULTIPOLYGON")) {
            if (aGeo.startsWith("MULTIPOLYGON")) {
                return -1;
            } else {
                return 1;
            }
        } else if (aGeo.startsWith("MULTILINESTRING") || bGeo.startsWith("MULTILINESTRING")) {
            if (aGeo.startsWith("MULTILINESTRING")) {
                return -1;
            } else {
                return 1;
            }
        } else if (aGeo.startsWith("MULTIPOINT") || bGeo.startsWith("MULTIPOINT")) {
            if (aGeo.startsWith("MULTIPOINT")) {
                return -1;
            } else {
                return 1;
            }
        } else if (aGeo.startsWith("POLYGON") || bGeo.startsWith("POLYGON")) {
            if (aGeo.startsWith("POLYGON")) {
                return -1;
            } else {
                return 1;
            }
        } else if (aGeo.startsWith("LINESTRING") || bGeo.startsWith("LINESTRING")) {
            if (aGeo.startsWith("LINESTRING")) {
                return -1;
            } else {
                return 1;
            }
        }

        return 0;
    });
}

let worker;
let latestString;

export function clusterObjects(res, text, setMethod) {
    if (window.Worker ) {
        latestString = text;

        if (!worker) {
            worker = new Worker("./worker.js");
        }

        worker.postMessage(res);

        worker.onmessage = (data) => {
            data = data.data;

            if(text === latestString){

                let results = data.resultaat.map(res => {
                    return new Resultaat(
                        res._url,
                        res._naam,
                        res._type,
                        res._geoJson,
                        res._color,
                        res.__objectClass
                    )
                });
                let clusters = data.clusters.map(res => {
                    let values = res._values;

                    values = values.map(res => {
                        return new Resultaat(
                            res._url,
                            res._naam,
                            res._type,
                            res._geoJson,
                            res._color,
                            res.__objectClass
                        )
                    });

                    if(values.length > 1){
                        return new ClusterObject(
                            res._naam,
                            res._type,
                            res._geoJson,
                            values,
                            res._color,
                            res._objectClass
                        );
                    }else{
                        return values[0];
                    }



                });

                let res = clusters.concat(results);

                if(text !== undefined){
                    res = bringExactNameToFront(text, res);
                }

                setMethod(res, text === undefined);
            }
        };

        return "waiting";
    } else {
        let map = new Map();

        for (let i = res.length - 1; i >= 0; i--) {
            let naam = res[i].getType() === "Waterloop" ? res[i].getNaam() + res[i].getType() : res[i].getNaam() + res[i].getObjectClass();

            if (res[i].getType() === "Waterloop" || res[i].getObjectClass() === "Wegdeel") {
                if (map.has(naam)) {
                    map.get(naam).push(res[i]);
                } else {
                    map.set(naam, [res[i]]);
                }

                res.splice(i, 1);
            }
        }

        let clusterMap = new Map();

        map.forEach((value, key, map) => {
            let mapCounter = 0;

            while (value.length > 0) {
                let eerste = value.shift();
                let cluster = [eerste];

                clusterMap.set(eerste.getNaam() + mapCounter, cluster);
                mapCounter++;

                for (let i = 0; i < cluster.length; i++) {
                    for (let j = value.length - 1; j >= 0; j--) {
                        let inter = turf.lineIntersect(cluster[i].getGeoJson(), value[j].getGeoJson());

                        if (inter.features.length > 0) {
                            cluster.push(value[j]);
                            value.splice(j, 1);
                        }
                    }
                }
            }
        });

        let clusters = [];

        clusterMap.forEach(value => {
            if(value.length > 1){
                let first = value[0];
                let geoJSON = [];

                value.forEach(res => {
                    let geo;

                    if (res.getGeoJson().type !== "Polygon") {
                        geo = turf.buffer(res.getGeoJson(), 0.0001).geometry;
                    } else {
                        geo = res.getGeoJson();
                    }

                    geoJSON.push({
                            type: 'Feature',
                            geometry: geo
                        }
                    )
                });

                geoJSON = turf.union(...geoJSON).geometry;

                clusters.push(new ClusterObject(first.getNaam(), first.getType(), geoJSON, value, first.getColor(), first.getObjectClass()));
            }else{
                clusters.push(value[0])
            }

        });

        return bringExactNameToFront(text, clusters.concat(res));
    }
}

export function bringExactNameToFront(string, res) {
    let j = 0;
    string = string.toUpperCase();

    for (let i = 0; i < res.length; i++) {
        if (string === res[i].getNaam().toUpperCase()) {
            let x = res[j];
            res[j] = res[i];
            res[i] = x;

            j++;
        }
    }

    return res;
}

/**
 *
 * @param res
 * @param latestString
 * @returns {[]}
 */
export function processSearchScreenResults(res, latestString) {
    let returnObject = [];
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

        sortByGeoMetryAndName(valueMap, latestString);

        let fO = valueMap[0];

        if ((fO.brugnaam && fO.brugnaam.value.toUpperCase() === latestString.toUpperCase())
            || (fO.tunnelnaam && fO.tunnelnaam.value.toUpperCase() === latestString.toUpperCase())
            || (fO.sluisnaam && fO.sluisnaam.value.toUpperCase() === latestString.toUpperCase())
            || (fO.knooppuntnaam && fO.knooppuntnaam.value.toUpperCase() === latestString.toUpperCase())) {
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
        } else if (fO.offnaam && fO.offnaam.value.toUpperCase() === latestString.toUpperCase()) {
            //kijk of het resultaat niet undefined is. Kijk ook of het gezochte string een deel van de naam bevat.
            //Dit heb je nodig want bijvoorbeeld bij frieze namen moet de applicatie de frieze naam laten zien.
            naam = fO.offnaam.value;
        } else if (fO.naamFries && fO.naamFries.value.toUpperCase() === latestString.toUpperCase()) {
            //kijk of het resultaat niet undefined is. Kijk ook of het gezochte string een deel van de naam bevat.
            //Dit heb je nodig want bijvoorbeeld bij frieze namen moet de applicatie de frieze naam laten zien.
            naam = fO.naamFries.value;
        } else if (fO.naamNl && fO.naamNl.value.toUpperCase() === latestString.toUpperCase()) {
            naam = fO.naamNl.value;
        } else if (fO.naam && fO.naam.value.toUpperCase() === latestString.toUpperCase()) {
            naam = fO.naam.value;
        } else if ((fO.brugnaam && fO.brugnaam.value.toUpperCase().includes(latestString.toUpperCase()))
            || (fO.tunnelnaam && fO.tunnelnaam.value.toUpperCase().includes(latestString.toUpperCase()))
            || (fO.sluisnaam && fO.sluisnaam.value.toUpperCase().includes(latestString.toUpperCase()))
            || (fO.knooppuntnaam && fO.knooppuntnaam.value.toUpperCase().includes(latestString.toUpperCase()))
        ) {
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
        } else if (fO.offnaam && fO.offnaam.value.toUpperCase().includes(latestString.toUpperCase())) {
            //kijk of het resultaat niet undefined is. Kijk ook of het gezochte string een deel van de naam bevat.
            //Dit heb je nodig want bijvoorbeeld bij frieze namen moet de applicatie de frieze naam laten zien.
            naam = fO.offnaam.value;
        } else if (fO.naamFries && fO.naamFries.value.toUpperCase().includes(latestString.toUpperCase())) {
            //kijk of het resultaat niet undefined is. Kijk ook of het gezochte string een deel van de naam bevat.
            //Dit heb je nodig want bijvoorbeeld bij frieze namen moet de applicatie de frieze naam laten zien.
            naam = fO.naamFries.value;
        } else if (fO.naamNl && fO.naamNl.value.toUpperCase().includes(latestString.toUpperCase())) {
            naam = fO.naamNl.value;
        } else if (fO.naam && fO.naam.value.toUpperCase().includes(latestString.toUpperCase())) {
            naam = fO.naam.value;
        } else {
            if (fO.naam) {
                naam = fO.naam.value;
            } else if (fO.naamNl) {
                naam = fO.naamNl.value;
            } else if (fO.naamFries) {
                naam = fO.naamFries.value;
            }
        }

        //krijg de type
        if (fO.type !== undefined) {
            let indexes = [];

            //sorteer dit op basis van relevantie.
            for (let j = 0; j < valueMap.length; j++) {
                let value = stripUrlToType(valueMap[j].type.value);
                let index = getIndexOfClasses(value);
                indexes.push({index: index, type: value});
            }

            indexes.sort((a, b) => {
                return a.index - b.index;
            });

            let value = indexes[0].type;
            type = seperateUpperCase(value);
            objectClass = seperateUpperCase(indexes[indexes.length - 1].type);

            color = getColor(indexes[indexes.length - 1].type);
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

export function processGetAllAttributes(res, clickedRes) {
    let nodes = res.results.bindings;

    let naam;
    let naamNl;
    let naamFries;
    let naamOfficieel;
    let burgNaam;
    let tunnelNaam;
    let knoopPuntNaam;
    let sluisNaam;
    let types = [];
    let overigeAttributen = [];

    /**
     * Ga langs elk attribuut en voeg deze toe aan de correct attribuut
     */
    for (let i = 0; i < nodes.length; i++) {
        let key = stripUrlToType(nodes[i].prd.value);
        let value = nodes[i].obj.value;

        if (key === "naam") {
            naam = value;
        } else if (key === "brugnaam") {
            value = value.replace(/\|/g, "");
            burgNaam = value;
        } else if (key === "tunnelnaam") {
            value = value.replace(/\|/g, "");
            tunnelNaam = value;
        } else if (key === "sluisnaam") {
            value = value.replace(/\|/g, "");
            sluisNaam = value;
        } else if (key === "knooppuntnaam") {
            value = value.replace(/\|/g, "");
            knoopPuntNaam = value;
        } else if (key === "naamNL") {
            naamNl = value;
        } else if (key === "naamFries") {
            naamFries = value;
        } else if (key === "type") {
            types.push((stripUrlToType(value)));
        } else if (key === "naamOfficieel") {
            naamOfficieel = value.replace(/\|/g, "");
        } else if (key !== "label") {
            let formattedKey;

            if (key === "isBAGnaam") {
                formattedKey = "BAG-naam";
            } else if (key === "isBAGwoonplaats") {
                formattedKey = "BAG-woonplaats";
            } else if (key === "aantalinwoners") {
                formattedKey = "Aantal inwoners"
            } else {
                formattedKey = seperateUpperCase(key)
            }

            if (key === "soortnaam" || key === "isBAGwoonplaats" || key === "bebouwdeKom" || key === "aantalinwoners" || key === "getijdeinvloed"
                || key === "hoofdafwatering" || key === "isBAGnaam" || key === "elektrificatie" || key === "gescheidenRijbaan") {

                if (key !== "aantalinwoners" && key !== "soortnaam") {
                    value = veranderNaarJaNee(value);
                }

                overigeAttributen.unshift({key: (formattedKey), value: value});
            } else {
                overigeAttributen.push({key: (formattedKey), value: value});
            }
        }
    }

    /**
     * Sorteer types van subclass naar hoofdclass
     * @type {array van types}
     */
    let indexes = [];
    for (let i = 0; i < types.length; i++) {
        let index = getIndexOfClasses(types[i]);
        let value = seperateUpperCase(types[i]);
        indexes.push({index: index, type: value});
    }

    indexes.sort((a, b) => {
        return a.index - b.index;
    });

    if (clickedRes.getRes().getGeoJson().type !== "Point") {
        let area = calculateArea(clickedRes.getAsFeature());
        overigeAttributen.push({key: "oppervlakte", value: area});
    }

    /**
     * Laad de attributen in de clicked res
     */
    clickedRes.loadInAttributes(
        naam,
        naamOfficieel,
        naamNl,
        naamFries,
        [indexes[0].type],
        overigeAttributen,
        burgNaam,
        tunnelNaam,
        sluisNaam,
        knoopPuntNaam);
}

function calculateArea(feature) {
    let area = Math.round(turf.area(feature));
    return area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " m2";
}