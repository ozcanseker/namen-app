import Observable from "./Observable";

/**
 * Dit is het object dat een waterloop of straat cluster bevat.
 */
class ClusterObject extends Observable{
    /**
     * @param naam
     * @param type
     * @param geoJSON van het totaal object
     * @param values
     * @param color
     * @param objectClass
     */
    constructor(naam, type,geoJSON ,values, color, objectClass){
        super();

        this._naam = naam;
        this._type = type;
        this._geoJson = geoJSON;
        this._values = values;
        this._color = color;
        this._objectClass = objectClass;

        this._onHoverDef = undefined;
        this._onHoverOffDef = undefined;
    }

    getColor(){
        return this._color;
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

    getValues(){
        return this._values;
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

    getValuesAsFeatures() {
        return this._values.map(res => {
            return res.getAsFeature();
        })
    }

    getAsFeature(){
        return  {
            type: "Feature",
            properties: this,
            geometry: this._geoJson
        }
    }
}

export default ClusterObject;