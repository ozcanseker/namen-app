/**
 * Het resultaat dat aangeklikt is.
 * Kan op twee manieren gegevens in laden. Met de constructor of de methode loadInAttributes.
 */
import Observable from "./Observable";

class ClickedResultaat extends Observable {
    constructor(res, naam, naamOfficieel, naamNl, naamFries, types, overige) {
        super();

        this._res = res;
        this._naam = naam;
        this._naamOfficieel = naamOfficieel;
        this._naamNL = naamNl;
        this._naamFries = naamFries;

        if (types) {
            this._types = types;
        } else {
            this._types = [];
        }

        if (overige) {
            this._overige = overige;
            let url = this._res.getUrl();
            this._overige.unshift({key: "brt link", value: url})
        } else {
            this._overige = [];
        }

        if (this._naam === undefined) {
            if (this._naamOfficieel !== undefined) {
                this._naam = naamOfficieel;
            } else if (this._naamNL !== undefined) {
                this._naam = this._naamNL;
            } else {
                this._naam = this._naamFries;
            }
        }
    }

    getNaamFries() {
        return this._naamFries;
    }

    getNaamNl() {
        return this._naamNL;
    }

    getColor(){
        return this._res.getColor();
    }

    /**
     *
     * @param naam String
     * @param naamOfficieel String
     * @param naamnl String
     * @param naamfries String
     * @param type array Strings
     * @param overige array {key: string, value: string}
     */
    loadInAttributes(naam, naamOfficieel, naamnl, naamfries, type, overige, burgNaam, tunnelNaam, sluisNaam, knoopPuntNaam) {
        this._naam = naam;
        this._naamOfficieel = naamOfficieel;
        this._naamNL = naamnl;
        this._naamFries = naamfries;
        this._types = type;
        this._overige = overige;
        this._brugNaam = burgNaam;
        this._tunnelNaam = tunnelNaam;
        this._sluisNaam = sluisNaam;
        this._knoopPuntNaam = knoopPuntNaam;

        let url = this._res.getUrl();
        this._overige.unshift({key: "brt link", value: url});

        if (this._naam === undefined) {
            if (this._naamOfficieel !== undefined) {
                this._naam = this._naamOfficieel;
            } else if (this._naamNL !== undefined) {
                this._naam = this._naamNL;
            } else {
                this._naam = this._naamFries;
            }
        }

        this.updateSubscribers();
    }

    getNaamOfficieel() {
        return this._naamOfficieel;
    }

    getUrl() {
        return this._res.getUrl();
    }

    getNaam() {
        return this._naam;
    }

    getAsFeature() {
        return this._res.getAsFeature();
    }

    getTypeString() {
        return this._types.join(", ");
    }

    getAttributes() {
        return this._overige;
    }

    getTunnelNaam(){
        return this._tunnelNaam;
    }

    getSluisNaam(){
        return this._sluisNaam;
    }

    getBrugNaam(){
        return this._brugNaam;
    }

    getKnooppuntNaam(){
        return this._knoopPuntNaam;
    }
}

export default ClickedResultaat;