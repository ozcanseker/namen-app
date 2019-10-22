import React from 'react';
import {Route, Switch} from 'react-router-dom';

import StartScreen from "./components/StartScreen";
import ResultScreen from "./components/ResultScreen";
import ObjectScreen from "./components/ObjectScreen";

class Routes extends React.Component{
    render() {
        return(
            <Switch>
                <Route exact path="/" component={StartScreen}/>
                <Route
                    path="/result"
                    render={(props) => <ResultScreen res = {this.props.res}/>}
                />
                <Route exact path="/result/:id" component={ObjectScreen}/>
            </Switch>
        )
    }
}

export default Routes;