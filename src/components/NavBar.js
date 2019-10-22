import React from 'react';
import {Route, Switch} from 'react-router-dom';


class NavBar extends React.Component{
    render() {
        return(
            <Switch>
                <Route exact path="/"
                       render={(props) => <EmptyBar loading = {this.props.loading}/>}
                />
                <Route
                    render={(props) => <BackButton loading = {this.props.loading} onBack = {this.props.onBack}/>}
                />
            </Switch>
        )
    }
}

function EmptyBar(props){
    let class_ = "nonLoadingButton";

    if( props.loading){
        class_ = "loadingButton";
    }

    return (
        <div className={"backButton  " + class_}><p>&nbsp;</p></div>
    )
}

function BackButton(props){
    let class_ = "nonLoadingButton";

    if( props.loading){
        class_ = "loadingButton";
    }

    return (
        <div className={"backButton cursorPointer " + class_} onClick={props.onBack}><p>&larr; Terug</p></div>
    )
}

export default NavBar;