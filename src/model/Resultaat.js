/**
 * Een resultaat op het resultaten scherm.
 */
import Observable from "./Observable";

class Resultaat extends Observable{
    constructor(url , naam, type, geoJson, color, objectClass){
        super();
        this._url = url;

        this._naam = naam;
        this._type = type;
        this._geoJson = geoJson;
        this._color = color;
        this._objectClass = objectClass;

        this._onHoverDef = undefined;
        this._onHoverOffDef = undefined;
    }

    /**
     * Wordt gebruikt om de rest van de attributen in te laden
     * @param naam string
     * @param type string
     * @param geojson GeoJson
     * @param color color of the drawn element
     * @param objectClass
     */
    setSecondProperties(naam, type, geojson, color, objectClass){
        this._type = type;
        this._naam = naam;
        this._geoJson = geojson;
        this._color = color;
        this._objectClass = objectClass;

        this.updateSubscribers();
    }

    getObjectClass(){
        return this._objectClass;
    }

    getNaam(){
        return this._naam;
    }

    getUrl(){
        return this._url;
    }

    getType(){
        return this._type;
    }

    getGeoJson(){
        return this._geoJson;
    }

    setGeoJson(geoJson){
        this._geoJson = geoJson;
    }

    getColor(){
        return this._color;
    }

    /**
     * Geeft een feature object terug met zichzelf en geojson
     * @returns {{geometry: GeoJson, type: string, properties: Resultaat}}
     */
    getAsFeature(){
        return  {
            type: "Feature",
            properties: this,
            geometry: this._geoJson
        }
    }

    _setOnHover(func){
        this._onHoverDef = func;
    }

    _setOnHoverOff(func){
        this._onHoverOffDef = func;
    }

    _onHover(){
        if(this._onHoverDef){
            this._onHoverDef();
        }
    }

    _onHoverOff(){
        if (this._onHoverOffDef) {
            this._onHoverOffDef()
        }
    }
}

export default Resultaat;