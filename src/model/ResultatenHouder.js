/**
 * Houdt resultaat bij. Update de app als er iets verandert.
 */
class ResultatenHouder {
    constructor(){
        this._results = [];
        this._doubleClickedResults = [];
        this._clickedResult = undefined;

        this._subscribers = [];
    }

    upDateSubScribers(){
        this._subscribers.map(subscriber => subscriber.update());
    }

    /**
     * Subscribe aan de resultaten houder.
     * De gesubscribte class moet update implementeren.
     * vergeet ook niet om te unsubscriben.
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

    /**
     * Zet een clickedresultaat en subscribe aan deze
     * @param clicked
     */
    setClickedResult(clicked){
        this._clickedResult = clicked;
        this._clickedResult.subscribe(this);
        this.upDateSubScribers();
    }

    getClickedResult(){
        return this._clickedResult;
    }

    /**
     * undefine de clicked resultaat en unsubscribe
     */
    clearClickedResult(){
        if(this._clickedResult){
            this._clickedResult.unsubscribe(this);
            this._clickedResult = undefined;
            this.upDateSubScribers();
        }
    }

    /**
     * Clear alle resultaten en unsubscribe van all deze
     */
    clearAll(){
        if(this._clickedResult){
            this._clickedResult.unsubscribe(this);
            this._clickedResult = undefined;
        }

        this._results.forEach(res => {
            res.unsubscribe(this);
        })

        this._results = [];

        this._doubleClickedResults.forEach(res => {
            res.unsubscribe(this);
        })

        this._doubleClickedResults = [];

        this.upDateSubScribers();
    }

    /**
     * Zet results en subscribe aan al deze
     * @param results
     */
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

    /**
     * Clear de resultaten
     */
    clearResults(){
        this._results.forEach(res => {
            res.unsubscribe(this);
        })

        this._results = [];

        this.upDateSubScribers();
    }

    /**
     * Zet results en subscribe aan al deze
     * @param results
     */
    setDoubleResults(results){

        this._doubleClickedResults.forEach(res => {
            res.unsubscribe(this);
        })

        results.forEach(res => {
            res.subscribe(this);
        })

        this._doubleClickedResults = results;
        this.upDateSubScribers();
    }

    getDoubleResults(){
        return this._doubleClickedResults;
    }

    /**
     * Clear de resultaten
     */
    clearDoubleResults(){
        this._doubleClickedResults.forEach(res => {
            res.unsubscribe(this);
        })

        this._doubleClickedResults = [];

        this.upDateSubScribers();
    }

    update(){
        this.upDateSubScribers();
    }

    /**
     * Krijg alle resultaten behalve clicked resultaat als feature terug.
     * @returns {[Feature]}
     */
    getSearchedAllObjectsAsFeature(){
        let geojson = [];

        this._results.forEach(res => {
            if(res.getGeoJson()) {
                geojson.push(res.getAsFeature());
            }
        })
        return geojson;
    }

    getClickedAllObjectsAsFeature(){
        let geojson = [];

        this._doubleClickedResults.forEach(res => {
            if(res.getGeoJson() && res.getType() !== "Land" && res.getType() !== "Provincie") {
                geojson.push(res.getAsFeature());
            }
        })
        return geojson;
    }
}

export default ResultatenHouder;