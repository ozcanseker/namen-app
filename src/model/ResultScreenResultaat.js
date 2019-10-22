class ResultScreenResultaat {
    constructor(url){
        this._url = url;
        this._naam = undefined;
        this._type = undefined;

        this._subscribers = [];
    }

    setNaam(naam){
        this._naam = naam;
    }

    getNaam(){
        return this._naam;
    }

    getUrl(){
        return this._url;
    }

    setType(type){
        this._type = type;
        this.upDateSubScribers();
    }

    getType(){
        return this._type;
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