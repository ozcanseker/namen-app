/**
 * Libs
 */
import L from "leaflet";
import React from 'react';
import * as turf from '@turf/turf';

/**
 * UI
 */
import Routes from './routes/Routes'
import {Search, Icon} from 'semantic-ui-react'
import NavBar from "./components/NavBar";
import Loader from "./components/Loader"

/**
 * Assets
 */
import './App.css';
import KadasterImg from './assets/Logo-kadaster.png';

/**
 * Netwerk
 */
import *  as Communicator from './network/Communicator' ;
import {Link, withRouter, matchPath} from "react-router-dom";

/**
 * Model
 */
import ResultatenHouder from './model/ResultatenHouder';
import ClickedResultaat from "./model/ClickedResultaat";



class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: "",
            isFetching: false,
            results: new ResultatenHouder(),
            updateIng : false
        }

        this.state.results.subscribe(this);
    }

    componentDidMount() {
        this.mapInit();
        this.props.history.push('/');
    }

    mapInit = () => {
        this.map = L.map(
            'map',
            {
                minZoom: 7,
                center: [52.20936, 5.2],
                zoom: 8,
                maxBounds: [
                    [56, 10],
                    [49, 0],
                ]
            });

        L.tileLayer('https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:3857/{z}/{x}/{y}.png', {
            attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl/">Kadaster</a> | <a href="https://www.verbeterdekaart.nl">Verbeter de kaart</a> '
        }).addTo(this.map);

        this.map.on('dblclick', this.handleDoubleClick);
        this.map.doubleClickZoom.disable();

        this.geoJsonLayer = L.geoJSON([], {
            onEachFeature: this.addCenterMarker,
            pointToLayer: this.addMarker
        }).addTo(this.map);

        this.markerGroup = L.featureGroup().addTo(this.map);
    }

    handleDoubleClick(e){
        let latLong = e.latlng;
        console.log(latLong);
    }

    addMarker = (feature, latlng) => {
        let marker = L.marker(latlng).addTo(this.markerGroup);

        marker.bindPopup(`<div class = "marker">
                    <b>${feature.properties.getNaam()}</b>
                    <br/>
                    <span class = "subTextMarker">${feature.properties.getType()}</span><div>
            `, {
            autoPan: false,
            closeButton: false
        });
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });

        marker.on('click', () => {
            this.onClickItem(feature.properties)
        });
    }

    addCenterMarker = (feature, layer) => {
        if (feature.geometry.type !== 'Point') {
            var centroid = turf.centroid(feature);
            var lon = centroid.geometry.coordinates[0];
            var lat = centroid.geometry.coordinates[1];

            let marker = L.marker([lat, lon]).addTo(this.markerGroup);

            marker.bindPopup(`<div class = "marker">
                    <b>${feature.properties.getNaam()}</b>
                    <br/>
                    <span class = "subTextMarker">${feature.properties.getType()}</span><div>
            `, {
                autoPan: false,
                closeButton: false
            });

            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });

            marker.on('click', () => {
                this.onClickItem(feature.properties)
            });

            layer.bindPopup(`<div class = "marker">
                    <b>${feature.properties.getNaam()}</b>
                    <br/>
                    <span class = "subTextMarker">${feature.properties.getType()}</span><div>
            `, {
                autoPan: false,
                closeButton: false
            });

            layer.on('mouseover', function (e) {
                this.openPopup();
            });
            layer.on('mouseout', function (e) {
                this.closePopup();
            });

            layer.on('click', () => {
                this.onClickItem(feature.properties)
            });
        }
    }

    onClickItem = (res) => {
        let clickedRes = new ClickedResultaat(res);
        this.state.results.setClickedResult(clickedRes);

        let center = this.getCenterGeoJson(res.getGeoJson());
        let zoom = this.map.getZoom();

        if(zoom < 10){
            zoom = 10;
        }

        this.map.setView(center , zoom);

        this.props.history.push(`/result/${res.getNaam()}`);
    }

    getCenterGeoJson = (geojson) => {
        var centroid = turf.centroid(geojson);
        var lon = centroid.geometry.coordinates[0];
        var lat = centroid.geometry.coordinates[1];

        return [lat, lon];
    }

    onSearchChange = (e, data) => {
        let text = data.value;

        if (text) {
            this.setState({
                searchQuery: text
            })

            this.state.results.clearClickedResult();

            this.doSearch(text);

            if (this.props.location.pathname === "/") {
                this.props.history.push('/result')
            } else if (this.props.location.pathname !== "/result") {
                this.props.history.goBack();
            }
        } else {
            this.setState({
                searchQuery: ""
            });

            this.state.results.clearAll();

            if (this.props.location.pathname === "/result") {
                this.props.history.goBack();
            }else if(this.props.location.pathname !== '/'){
                this.props.history.go(-2);
            }
        }

        if(this.map){
            this.map.setView([52.20936, 5.2], 8);
        }
    }

    doSearch = (text) => {
        this.setState({
            isFetching: true
        });

        Communicator.getMatch(text.trim()).then(res => {
            if (res === "error") {
                this.setState({
                    isFetching: false
                })
            } else if (res !== undefined) {
                this.setState({
                    isFetching: false
                })
                this.state.results.setResults(res);
            }
        });
    }

    handleDeleteClick = () => {
        this.onSearchChange({}, {value: ""});
        this.state.results.clearResults();
    }

    handleOnBackButtonClick = () => {
        this.props.history.goBack();

        let match = matchPath( this.props.location.pathname ,{
            path: "/result/:id",
            exact: true,
            strict: true
        })

        if (this.props.location.pathname === "/result") {
            this.setState({
                searchQuery: ""
            })

            this.state.results.clearResults();
            this.map.setView([52.20936, 5.2], 8);
        }else if(match){
            this.state.results.clearClickedResult();

            let timeout = 100;
            let results = this.state.results;

            if(results.getResults().length > 40){
                timeout = 600;
            }else if(results.getResults().length > 20){
                timeout = 200;
            } else if(results.getResults().length > 10){
                timeout = 100;
            }

            setTimeout(() => {
                let bounds = this.markerGroup.getBounds();
                let width = bounds.getEast() - bounds.getWest();
                let height = bounds.getNorth() - bounds.getSouth();

                console.log(width);
                console.log(height);

                if(width > 1.8 || height > 1.3){
                    this.map.fitBounds(this.markerGroup.getBounds());
                }else if(width > 1.3 || height > 1.0){
                    this.map.fitBounds(this.markerGroup.getBounds().pad(0.5));
                }else if (width > 0.1 || height > 0.1){
                    this.map.fitBounds(this.markerGroup.getBounds().pad(0.8));
                }else if(width > 0.01 || height > 0.01){
                    this.map.fitBounds(this.markerGroup.getBounds().pad(5));
                }else{
                    this.map.fitBounds(this.markerGroup.getBounds().pad(30));
                }

                }, timeout);
        }

    }

    update = () => {
        let results = this.state.results;

        this.setState({
            results: results
        })

        if(!this.updateIng){
            this.updateIng = true;
            this.setState({
                updateIng : true
            });

            let timeout = 0;

            if(this.state.results.getClickedResult()){
                timeout = 0;
            }else if(results.getResults().length > 40){
                timeout = 600;
            }else if(results.getResults().length > 20){
                timeout = 200;
            } else if(results.getResults().length > 10){
                timeout = 100;
            }

            setTimeout(() => {
                this.updateMap(results);
            }, timeout);
        }
    }

    updateMap = (results) =>{
        this.markerGroup.clearLayers();
        this.geoJsonLayer.clearLayers();

        if (this.state.results.getClickedResult()) {
            let feature = this.state.results.getClickedResult().getAsFeature();
            this.geoJsonLayer.addData(feature);
        } else {
            if (this.state.results.getClickedResult()) {
                console.log("fout");
            }
            let geoJsonResults = results.getAllObjectsAsFeature();
            this.geoJsonLayer.addData(geoJsonResults);
        }

        this.setState({
            updateIng : false
        });
        this.updateIng = false;
    }

    render() {
        let icon;
        let className;

        if (this.state.searchQuery) {
            icon = <Icon name='delete' link onClick={this.handleDeleteClick}/>;
        } else {
            icon = <Icon name='search'/>;
        }

        if(!this.state.updateIng){
            className = "mapHolder";
        }else{
            className = "mapHolderLoading"
        }

        return (
            <section className="App">
                <div className="brtInfo">
                    <Link to="/" onClick={() => {
                        this.setState({searchQuery: ""});
                        this.state.results.clearResults();
                    }}>
                        <div className="header">
                            <h1>Basisregistratie Topografie</h1><img src={KadasterImg} alt="kadaster logo"/>
                        </div>
                    </Link>
                    <div className="searchBar">
                        <Search input={{fluid: true}}
                                value={this.state.searchQuery}
                                noResultsMessage="Geen resultaat"
                                icon={icon}
                                onSearchChange={this.onSearchChange}
                                open={false}
                        />
                    </div>
                    {/*TODO maak hier een swipe animation*/}
                    <div className="resultsContainer">
                        <NavBar
                            loading={this.state.isFetching}
                            onBack={this.handleOnBackButtonClick}
                        />
                        <div className="loaderDiv">
                            <Loader
                                loading={this.state.isFetching}
                            />
                        </div>
                        <div className="resultPartContainer">
                            <Routes
                                res={this.state.results}
                                clickedResult={this.state.results.getClickedResult()}
                                onClickItem={this.onClickItem}
                            />
                        </div>
                    </div>
                    <div className="footer">
                        <a href="https://zakelijk.kadaster.nl/brt">Leer meer over de brt</a>
                    </div>
                </div>
                <div className= {className}>
                    <Loader
                        loading = {this.state.updateIng}
                    />
                    <div id="map"/>
                </div>
            </section>
        )
    }
}

export default withRouter(App);
