import React from 'react';
import * as Communicator from '../../network/Communicator';

class ObjectScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            res: undefined
        }
    }

    componentDidMount() {
        this.getNamenGegevens(this.props.clickedResult);
    }

    /**
     * Alle alle gegevens op van de clickedResult.
     * @param url
     */
    getNamenGegevens = (url) => {
        if (url) {
            Communicator.getAllAttribtes(this.props.clickedResult).then(res => {
                this.setState({
                    res: this.props.clickedResult
                })
            });
        }
    }

    render() {
        let res = this.state.res;
        let naam;
        let type;
        let tableNamen;
        let tableRest

        if (res) {
            naam = (<h1>{res.getNaam()}</h1>);
            type = (<h3>{res.getTypeString()}</h3>);

            let naamNl;
            let naamFries;
            let naamOfficeel;

            if (res.getNaamFries()) {
                naamFries = (
                    <tr>
                        <td><b>Naam Fries:</b></td>
                        <td>{res.getNaamFries()}</td>
                    </tr>
                )
            }

            if(res.getNaamOfficieel()){
                naamOfficeel = (
                    <tr>
                        <td><b>Naam officieel:</b></td>
                        <td>{res.getNaamOfficieel()}</td>
                    </tr>
                )
            }

            if (res.getNaamNl() || res.getNaamFries() === undefined) {
                naamNl = (
                    <tr>
                        <td><b>Naam Nederlands:</b></td>
                        <td>{res.getNaamNl() ? res.getNaamNl() : res.getNaam()}</td>
                    </tr>
                )
            }

            tableNamen = (
                <div>
                    <table className="namenTable">
                        <tbody>
                            {naamOfficeel}
                            {naamNl}
                            {naamFries}
                        </tbody>
                    </table>
                    <hr/>
                </div>
            );

            let attributes = res.getAttributes().map(res => {
                let value = res.value;

                if(value.startsWith("http://")){
                    value = (<a href={value} target="_blank" rel = "noreferrer noopener">{value}</a>);
                }

                return (<tr key = {res.key + res.value}>
                    <td>{res.key}</td>
                    <td>{value}</td>
                </tr>)
            })

            tableRest = (

                <table className="attributeSectionObjectScreen">
                    <tbody>
                    {attributes}
                    </tbody>
                </table>
            )
        }

        return (
            <div className="objectScreen">
                {naam}
                {type}
                {tableNamen}
                {tableRest}
            </div>
        )
    }
}

export default ObjectScreen;