import Observable from "./Observable";

class ClusterObject extends Observable{
    constructor(naam, type ,values, color, objectClass){
        super();

        this._naam = naam;
        this._type = type;
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

    getAsFeature(){
        let features = [];

        this._values.forEach(res => {
            features.push(res.getAsFeature());
        });

        return features;
    }
}

export default ClusterObject;