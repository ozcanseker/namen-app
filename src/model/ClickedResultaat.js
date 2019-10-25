/**
 * Het resultaat dat aangeklikt is.
 * De constructor wordt alleen een Resultaat scherm meegegeven.
 * loadInAttributes om de rest in te laden.
 */
class ClickedResultaat {
    constructor(res, naam, naamNl, naamFries, types, overige){
        this._res = res;
        this._naam = naam;
        this._naamNL = naamNl;
        this._naamFries = naamFries;

        if(types){
            this._types = types;
        }else{
            this._types = [];
        }

        if (overige) {
            this._overige = overige;
            let url = this._res.getUrl();
            this._overige.unshift({key : "brt link",value: url})
        }else{
            this._overige = [];
        }

        if(this._naam === undefined){
            if(this._naamNL !== undefined){
                this._naam = this._naamNL;
            }else{
                this._naam = this._naamFries;
            }
        }

        this._subscribers = [];
    }

    getNaamFries(){
        return this._naamFries;
    }

    getNaamNl(){
        return this._naamNL;
    }

    /**
     *
     * @param naam String
     * @param naamnl String
     * @param naamfries String
     * @param type array Strings
     * @param overige array {key: string, value: string}
     */
    loadInAttributes(naam, naamnl, naamfries, type,  overige){
        this._naam = naam;
        this._naamNL = naamnl;
        this._naamFries = naamfries;
        this._types = type;
        this._overige = overige;

        let url = this._res.getUrl();
        this._overige.unshift({key : "brt link",value: url})

        if(this._naam === undefined){
            if(this._naamNL !== undefined){
                this._naam = this._naamNL;
            }else{
                this._naam = this._naamFries;
            }
        }
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

    getUrl(){
        return this._res.getUrl();
    }

    getNaam(){
        return this._naam;
    }

    getAsFeature(){
        return this._res.getAsFeature();
    }

    getTypeString(){
        return this._types.join(", ");
    }

    getAttributes(){
        return this._overige;
    }
}

export default ClickedResultaat;