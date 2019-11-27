/**
 * Houdt resultaat bij. Update de app als er iets verandert.
 */
import Observable from "./Observable";
import {isShownClickedResults, sortByObjectClass} from "../network/ProcessorMethods";

class ResultatenHouder extends Observable{
    constructor(){
        super();

        this._results = [];
        this._rightClickedResults = [];
        this._clickedResult = undefined;
    }

    /**
     * Zet een clickedresultaat en subscribe aan deze
     * @param clicked
     */
    setClickedResult(clicked){
        this._clickedResult = clicked;
        this._clickedResult.subscribe(this);
        this.updateSubscribers();
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
            this.updateSubscribers();
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
        });

        this._results = [];

        this._rightClickedResults.forEach(res => {
            res.unsubscribe(this);
        });

        this._rightClickedResults = [];

        this.updateSubscribers();
    }

    /**
     * Zet results en subscribe aan al deze
     * @param results
     */
    setResults(results){
        this._results.forEach(res => {
            res.unsubscribe(this);
        });

        results.forEach(res => {
            res.subscribe(this);
        });

        this._results = results;
        this.updateSubscribers();
    }

    getResults(){
        return this._results;
    }

    /**
     * Clear de resultaten
     */
    clearResults(){
        if(this._results.length > 0){
            this._results.forEach(res => {
                res.unsubscribe(this);
            });

            this._results = [];

            this.updateSubscribers();
        }
    }

    /**
     * Zet results en subscribe aan al deze
     * @param results
     */
    setDoubleResults(results){
        this._rightClickedResults.forEach(res => {
            res.unsubscribe(this);
        });

        results.forEach(res => {
            res.subscribe(this);
        });

        this._rightClickedResults = results;

        this.updateSubscribers();
    }

    getRightClickedRes(){
        return this._rightClickedResults;
    }

    /**
     * Clear de resultaten
     */
    clearDoubleResults(){
        if(this._rightClickedResults.length > 0){
            this._rightClickedResults.forEach(res => {
                res.unsubscribe(this);
            });

            this._rightClickedResults = [];

            this.updateSubscribers();
        }
    }

    update(){
        this.updateSubscribers();
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
        });

        sortByObjectClass(geojson);

        return geojson;
    }

    getClickedAllObjectsAsFeature(){
        let geojson = [];

        this._rightClickedResults.forEach(res => {
            if(res.getGeoJson() && isShownClickedResults(res)) {
                geojson.push(res.getAsFeature());
            }
        });

        sortByObjectClass(geojson);

        return geojson;
    }
}

export default ResultatenHouder;