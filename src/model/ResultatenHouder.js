/**
 * Houdt resultaat bij. Update de app als er iets verandert.
 */
import Observable from "./Observable";
import {isShownClickedResults, sortByObjectClass} from "../network/ProcessorMethods";
import ClusterObject from "./ClusterObject";

class ResultatenHouder extends Observable {
    constructor() {
        super();

        this._results = [];
        this._rightClickedResults = [];
        this._clickedResult = undefined;
        this._clickedCluster = undefined;
    }

    setClickedCluster(clickedCluster){
        if(this._clickedCluster){
            this._clickedCluster.unsubscribe(this);
        }

        this._clickedCluster = clickedCluster;
        this._clickedCluster.subscribe(this);

        this.updateSubscribers();
    }

    getClickedCluster(){
        return this._clickedCluster;
    }

    clearClickedCluster(){
        if(this._clickedCluster){
            this._clickedCluster.unsubscribe(this);
            this._clickedCluster = undefined;
            this.updateSubscribers();
        }
    }

    /**
     * Zet een clickedresultaat en subscribe aan deze
     * @param clicked
     */
    setClickedResult(clicked) {
        if(this._clickedResult){
            this._clickedResult.unsubscribe(this);
        }

        this._clickedResult = clicked;
        this._clickedResult.subscribe(this);
        this.updateSubscribers();
    }

    getClickedResult() {
        return this._clickedResult;
    }

    /**
     * undefine de clicked resultaat en unsubscribe
     */
    clearClickedResult() {
        if (this._clickedResult) {
            this._clickedResult.unsubscribe(this);
            this._clickedResult = undefined;
            this.updateSubscribers();
        }
    }

    /**
     * Clear alle resultaten en unsubscribe van all deze
     */
    clearAll() {
        //geklikt resultaat
        if (this._clickedResult) {
            this._clickedResult.unsubscribe(this);
            this._clickedResult = undefined;
        }

        //geklikte cluster
        if(this._clickedCluster){
            this._clickedCluster.unsubscribe(this);
            this._clickedCluster = undefined;
        }

        //gezochte resultaten
        this._results.forEach(res => {
            res.unsubscribe(this);
        });
        this._results = [];

        //rechts gezochte resultaten.
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
    setResults(results) {
        this._results.forEach(res => {
            res.unsubscribe(this);
        });

        results.forEach(res => {
            res.subscribe(this);
        });

        this._results = results;
        this.updateSubscribers();
    }

    getResults() {
        return this._results;
    }

    /**
     * Clear de resultaten
     */
    clearResults() {
        if (this._results.length > 0) {
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
    setDoubleResults(results) {
        this._rightClickedResults.forEach(res => {
            res.unsubscribe(this);
        });

        results.forEach(res => {
            res.subscribe(this);
        });

        this._rightClickedResults = results;

        this.updateSubscribers();
    }

    getRightClickedRes() {
        return this._rightClickedResults;
    }

    /**
     * Clear de resultaten
     */
    clearDoubleResults() {
        if (this._rightClickedResults.length > 0) {
            this._rightClickedResults.forEach(res => {
                res.unsubscribe(this);
            });

            this._rightClickedResults = [];

            this.updateSubscribers();
        }
    }

    update() {
        this.updateSubscribers();
    }

    /**
     * Krijg alle resultaten behalve clicked resultaat als feature terug.
     * @returns {[Feature]}
     */
    getSearchedAllObjectsAsFeature() {
        let geojson = [];

        this._results.forEach(res => {
            if (res instanceof ClusterObject) {
                geojson.push(res.getAsFeature());
            } else if (res.getGeoJson()) {
                geojson.push(res.getAsFeature());
            }
        });

        sortByObjectClass(geojson);

        return geojson;
    }

    getClickedAllObjectsAsFeature() {
        let geojson = [];

        this._rightClickedResults.forEach(res => {
            if (res instanceof ClusterObject) {
                geojson.push(res.getAsFeature());
            }else if (res.getGeoJson() && isShownClickedResults(res)) {
                geojson.push(res.getAsFeature());
            }
        });

        sortByObjectClass(geojson);

        return geojson;
    }
}

export default ResultatenHouder;