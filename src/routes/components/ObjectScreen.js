import React from 'react';

class ObjectScreen extends React.Component {
    render() {
        return(
            <div className="homeScreen">
                <p>{JSON.stringify(this.props.result)}</p>
            </div>
        )
    }
}

export default ObjectScreen;