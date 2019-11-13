/**
 * Een file die alle classen van de brt bevat.
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

function PreProcessResultList(nodes){

}

function PreProcessAttributes(nodes){

}

export function isShownClickedResults(res){
    return res.getType() !== "Land" && res.getType() !== "Provincie";
}

export function getColor(type){
    switch (type) {
        case "FunctioneelGebied": return "green";
        case "Gebouw": return "red";
        case "GeografischGebied": return undefined;
        case "Hoogte": return undefined;
        case "Inrichtingselement": return "purple";
        case "Plaats": return "turqoise";
        case "PlanTopografie": return undefined;
        case "RegistratiefGebied": return "yellow";
        case "Spoorbaandeel": return "purple";
        case "Terrein": return undefined;
        case "Relief": return undefined;
        case "Waterdeel": return "blue";
        case "Wegdeel": return "purple";
    }
}

/**
 * Used for layering
 * @param list
 */
export function sortByObjectClass(list){
    list.sort((a , b) => {
        console.log(a.getType() === "Gemeente" || b.getType() === "Gemeente");
        if(a.getType() === "Gemeente" || b.getType() === "Gemeente"){
            if(a.getType() === "Gemeente" && b.getType() === "Gemeente"){
                return 0;
            }else if(a.getType() === "Gemeente"){
                return -1;
            }else {
                return 1;
            }
        }

        if(a.getType() === "Woonkern" || b.getType() === "Woonkern"){
            if(a.getType() === "Woonkern" && b.getType() === "Woonkern"){
                return 0;
            }else if(a.getType() === "Woonkern"){
                return -1;
            }else {
                return 1;
            }
        }

        if(a.getType() === "Stadsdeel" || b.getType() === "Stadsdeel"){
            if(a.getType() === "Stadsdeel" && b.getType() === "Stadsdeel"){
                return 0;
            }else if(a.getType() === "Stadsdeel"){
                return -1;
            }else {
                return 1;
            }
        }

        if(a.getType() === "Wijk" || b.getType() === "Wijk"){
            if(a.getType() === "Wijk" && b.getType() === "Wijk"){
                return 0;
            }else if(a.getType() === "Wijk"){
                return -1;
            }else {
                return 1;
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
    string = string.split(/(?=[A-Z])/);
    string.forEach((res, index, arr) => {

            if (index !== 0) {
                arr[index] = arr[index].charAt(0).toLowerCase() + arr[index].slice(1)
            }
        }
    )

    return string.join(" ");
}

/**
 * Verandert een 1 en 0 naar ja en nee.
 * @param string
 * @returns {string}
 */
export function veranderNaarJaNee(string) {
    if (string === "1" || string === "true") {
        return "ja";
    }
    return "nee";
}


