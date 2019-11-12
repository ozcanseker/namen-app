/**
 * Een resultaat op het resultaten scherm.
 */
class Resultaat {
    constructor(url , naam, type, geoJson){
        this._url = url;

        this._naam = naam;
        this._type = type;
        this._geoJson = geoJson;

        this._subscribers = [];

        this._onHoverDef = undefined;
        this._onHoverOffDef = undefined;
    }

    /**
     * Wordt gebruikt om de rest van de attributen in te laden
     * @param naam string
     * @param type string
     * @param geojson GeoJson
     */
    setSecondProperties(naam, type, geojson){
        this._type = type;
        this._naam = naam;
        this._geoJson = geojson;

        this.upDateSubScribers();
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

    upDateSubScribers(){
        this._subscribers.map(subscriber => subscriber.update());
    }

    subscribe(subscriber){
        this._subscribers.push(subscriber);
    }

    unsubscribe(subscriber){
        this._subscribers.filter(subscriberList  => {
            return subscriberList !== subscriber;
        });
    }

    /**
     * Geeft een feature object terug met zichzelf en geojson
     * @returns {{geometry: GeoJson, type: string, properties: Resultaat}}
     */
    getAsFeature(){
        return  {
            type: "Feature",
            properties: this,
            geometry: this.getGeoJson()
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