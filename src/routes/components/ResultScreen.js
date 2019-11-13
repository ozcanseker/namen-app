import React from 'react';

class ResultScreen extends React.Component {
    render() {

        let results = this.props.res.getRightClickedRes().length > 0 ? this.props.res.getRightClickedRes() : this.props.res.getResults();

        let elements = results.map(res => {
            let pElementHoofd = (<p className= "hoofdText">&nbsp;</p>)
            let pElementSub = (<p className= "subText">&nbsp;</p>)

            if(res.getNaam()){
                pElementHoofd = (<p className= "hoofdText">{res.getNaam()}</p>);
            }

            if(res.getType()){
                pElementSub = (<p className= "subText">{res.getType() ? res.getType() : String.fromCharCode(32)}</p>);
            }

            return (<li key={res.getUrl() + res.getNaam()}
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