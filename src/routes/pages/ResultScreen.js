import React from 'react';
import Resultaat from "../../model/Resultaat";

class ResultScreen extends React.Component {
    render() {
        let results;

        if(this.props.res.getClickedCluster()){
            results = this.props.res.getClickedCluster().getValues();
        }else{
            results = this.props.res.getRightClickedRes().length > 0 ? this.props.res.getRightClickedRes() : this.props.res.getResults();
        }

        let elements = results.map(res => {
            let pElementHoofd = (<p className= "hoofdText">&nbsp;</p>);
            let pElementSub = (<p className= "subText">&nbsp;</p>);

            if(res.getNaam()){
                pElementHoofd = (<p className= "hoofdText">{res.getNaam()}</p>);
            }

            if(res.getType()){
                let color;

                if(res.getColor()){
                    color = {color: this.props.getHexFromColor(res.getColor(), true)};
                }

                pElementSub = (<p className= "subText" style={color}>
                    {res.getType() ? res.getType() : String.fromCharCode(32)}</p>);
            }

            return (<li key={res instanceof Resultaat ? res.getUrl() + res.getNaam() : res.getNaam + res.getValues()[0].getUrl()}
                        className="liResultScreen"
                        onClick={() => {this.props.onClickItem(res)}}
                        onMouseEnter={() => {res._onHover()}}
                        onMouseLeave={() => {res._onHoverOff()}}>
                {pElementHoofd}
                {pElementSub}
            </li>)
        });

        return(
            <div className="homeScreen">
                <ul>
                    {elements}
                </ul>
            </div>
        )
    }
}

export default ResultScreen;