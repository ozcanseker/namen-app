import React from 'react';
import {Route, Switch} from 'react-router-dom';

import StartScreen from "./pages/StartScreen";
import ResultScreen from "./pages/ResultScreen";
import ObjectScreen from "./pages/ObjectScreen";

class Routes extends React.Component {
    render() {
        let router2;

        if(this.props.res.getClickedCluster()){
            router2 = (<Route
                exact path="/result/:id"
                render={(props) => <ResultScreen res={this.props.res}
                                                 onClickItem={this.props.onClickItem}
                                                 getHexFromColor={this.props.getHexFromColor}/>}
            />)
        }else{
            router2 = (<Route
                exact path="/result/:id"
                render={(props) => <ObjectScreen clickedResult=
                                                     {this.props.clickedResult}
                                                 getHexFromColor={this.props.getHexFromColor}/>}
            />)
        }


        return (
            <Switch>
                <Route exact path="/" component={StartScreen}/>
                <Route
                    exact path="/result"
                    render={(props) => <ResultScreen res={this.props.res}
                                                     onClickItem={this.props.onClickItem}
                                                     getHexFromColor={this.props.getHexFromColor}/>}
                />
                {router2}
                <Route
                    exact path="/result/:id/:idd"
                    render={(props) => <ObjectScreen clickedResult=
                                                         {this.props.clickedResult}
                                                     getHexFromColor={this.props.getHexFromColor}/>}
                />
            </Switch>
        )
    }
}

export default Routes;