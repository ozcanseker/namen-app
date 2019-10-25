class ResultScreenResultaat {
    constructor(url){
        this._url = url;

        this._naam = undefined;
        this._type = undefined;
        this._geoJson = undefined;

        this._subscribers = [];
    }

    setSecondProperties(type, naam, geojson){
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
}

export default ResultScreenResultaat;