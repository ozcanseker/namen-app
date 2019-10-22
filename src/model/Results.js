class Results {
    constructor(){
        this._results = [];
        this._subscribers = [];
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

    setResults(results){

        this._results.forEach(res => {
            res.unsubscribe(this);
        })

        results.forEach(res => {
            res.subscribe(this);
        })

        this._results = results;
        this.upDateSubScribers();
    }

    getResults(){
        return this._results;
    }

    clearResults(){
        this._results.forEach(res => {
            res.unsubscribe(this);
        })

        this.upDateSubScribers();
    }

    update(){
        this.upDateSubScribers();
    }
}

export default Results;