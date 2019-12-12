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
     * Haal alle gegevens op van de clickedResult.
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
        let tableRest;

        if (res) {
            if(res.getNaam()){
                naam = (<h1>{res.getNaam()}</h1>);
            }else{
                if(res.getTunnelNaam()){
                    naam = (<h1>{res.getTunnelNaam()}</h1>);
                }else if(res.getKnooppuntNaam()){
                    naam = (<h1>{res.getKnooppuntNaam()}</h1>);
                }else if(res.getBrugNaam()){
                    naam = (<h1>{res.getBrugNaam()}</h1>);
                }else if(res.getSluisNaam()){
                    naam = (<h1>{res.getSluisNaam()}</h1>);
                }
            }

            let color;

            if(res.getColor()){
                color = {color: this.props.getHexFromColor(res.getColor(), true)};
            }

            type = (<h3 style={color}>{res.getTypeString()}</h3>);

            let naamNl;
            let naamFries;
            let naamOfficeel;
            let naam2;
            let brugnaam;
            let sluisnaam;
            let knooppuntnaam;
            let tunnelnaam;

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

            if (res.getNaamNl()) {
                naamNl = (
                    <tr>
                         <td><b>Naam Nederlands:</b></td>
                         <td>{res.getNaamNl()}</td>
                     </tr>
                )
            }

            if (res.getTunnelNaam()) {
                tunnelnaam = (
                    <tr>
                        <td><b>Tunnel naam:</b></td>
                        <td>{res.getTunnelNaam()}</td>
                    </tr>
                )
            }

            if (res.getBrugNaam()) {
                brugnaam = (
                    <tr>
                        <td><b>Brug naam:</b></td>
                        <td>{res.getBrugNaam()}</td>
                    </tr>
                )
            }

            if (res.getSluisNaam()) {
                sluisnaam = (
                    <tr>
                        <td><b>Sluis naam:</b></td>
                        <td>{res.getSluisNaam()}</td>
                    </tr>
                )
            }

            if (res.getKnooppuntNaam()) {
                knooppuntnaam = (
                    <tr>
                        <td><b>Knooppunt naam:</b></td>
                        <td>{res.getKnooppuntNaam()}</td>
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
                            {naam2}
                            {tunnelnaam}
                            {brugnaam}
                            {sluisnaam}
                            {knooppuntnaam}
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