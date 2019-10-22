/**
 * Libs
 */
import L from "leaflet";
import React from 'react';

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
import KadasterImg from './assets/Logo-kadaster.png'

/**
 * Netwerk
 */
import *  as Sparql from './network/SparqlCommunicator' ;
import {Link, withRouter} from "react-router-dom";

/**
 * Model
 */
import Results from './model/Results';

//Naam is of naam of naamNl

//https://www.pdok.nl/datamodel/-/article/basisregistratie-topografie-brt-topnl#Campus
// PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
//
// SELECT distinct * WHERE {
//   ?sub rdf:type brt:School .
//   ?sub rdf:type ?p
// }

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: "",
            isFetching: false,
            results: new Results(),
            clickedRes: {}
        }

        this.state.results.subscribe(this);
    }

    componentDidMount() {
        this.map();
        this.props.history.push('/')
    }

    map = () => {
        let map = L.map(
            'map',
            {
                minZoom: 7,
                center: [52.20936, 5.170745],
                zoom: 8,
                maxBounds: [
                    [56, 10],
                    [49, 0],
                ]
            });

        L.tileLayer('https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:3857/{z}/{x}/{y}.png', {
            attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl/">Kadaster</a> | <a href="https://www.verbeterdekaart.nl">Verbeter de kaart</a> '
        }).addTo(map);

        // map.setView(new L.LatLng(), 7.5);
    }

    onSearchChange = (e, data) => {
        let text = data.value;

        if (text) {
            this.setState({
                searchQuery: text
            })

            this.doSearch(text);

            if (this.props.location.pathname === "/") {
                this.props.history.push('/result')
            } else if (this.props.location.pathname !== "/result") {
                this.props.history.goBack();
            }
        } else {
            this.setState({
                searchQuery: ""
            })

            this.state.results.clearResults();

            if (this.props.location.pathname === "/result") {
                this.props.history.goBack();
            }
        }
    }

    doSearch = (text) => {
        this.setState({
            isFetching: true
        });

        Sparql.getMatch(text.trim()).then(res => {
            if(res === "error"){
                this.setState({
                    isFetching: false
                })
            }else if (res !== undefined) {
                console.log(res);
                this.setState({
                    isFetching: false
                })
                this.state.results.setResults(res);
            }
        });
    }

    handleDeleteClick = () => {
        this.onSearchChange({}, {value: ""});
    }

    handleOnBackButtonClick = () => {
        this.props.history.goBack();

        if (this.props.location.pathname === "/result") {
            this.setState({
                searchQuery: ""
            })

            this.state.results.clearResults();
        }
    }

    update = () => {
        this.setState({
            results : this.state.results
        })
    }

    render() {
        let icon;

        if (this.state.searchQuery) {
            icon = <Icon name='delete' link onClick={this.handleDeleteClick}/>;
        } else {
            icon = <Icon name='search'/>;
        }

        return (
            <section className="App">
                <div className="brtInfo">
                    <Link to= "/" onClick={() => {this.setState({searchQuery: "", results: []})}}>
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
                        <Routes
                            res={this.state.results}
                        />
                    </div>
                    <div className="footer">
                        <a href="https://zakelijk.kadaster.nl/brt">Leer meer over de brt</a>
                    </div>
                </div>
                <div id="map"/>
            </section>
        )
    }
}

export default withRouter(App);
