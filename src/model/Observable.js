class Observable{
    constructor() {
        this._subscribers = [];
    }

    updateSubscribers(){
        this._subscribers.map(subscriber => subscriber.update());
    }

    /**
     * Als je wilt subscriben moet je de methode update implementeren.
     * Ook niet vergeten om te unsubscriben.
     * @param subscriber
     */
    subscribe(subscriber){
        this._subscribers.push(subscriber);
    }

    unsubscribe(subscriber){
        this._subscribers.filter(subscriberList  => {
            return subscriberList !== subscriber;
        });
    }
}

export default Observable;