import React from 'react';
import {BarLoader} from "react-spinners";


class Loader extends React.Component{
    render() {
        return(
            <BarLoader
                loading = {this.props.loading}
                width = {"100%"}
                color = {"#6495ED"}
                height = {4}
            />
        )
    }
}

export default Loader;