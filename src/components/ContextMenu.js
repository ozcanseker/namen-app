import React from 'react';
import './style/ContextMenu.scss'
import _ from 'lodash';

/**
 * Dit is het menu dat tervoorschijn komt om de laag te selecteren waar je naar toe wilt.
 */
class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthPage: 0,
            heightPage: 0,
        }
    }

    componentDidMount() {
        //Kijk wat de hoogte en breedte is van de pagina wanneer deze component tevoorschijn komt.
        this.updateWindowDimensions();

        //debounce zodat het niet tig keer wordt aangeroepen.
        this.updateWindowDimensionsDebounce = _.debounce(this.updateWindowDimensions, 200);
        window.addEventListener('resize', this.updateWindowDimensionsDebounce);
    }

    componentWillUnmount() {
        //Unmount de listener als de component sluit
        window.removeEventListener('resize', this.updateWindowDimensionsDebounce);
    }

    updateWindowDimensions = () => {
        //update de hoogte en breedte van huidige pagina
        this.setState({widthPage: window.innerWidth, heightPage: window.innerHeight});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        //Kijk wat de hoogte en breedte zullen zijn van de component zelf.
        if(this.state.yMenu !== this.div.clientHeight || this.state.xMenu !== this.div.clientWidth){
            this.setState({
                yMenu :  this.div.clientHeight,
                xMenu : this.div.clientWidth
            });
        }
    }

    onClick = (resOnClick) => {
        resOnClick();
        this.props.resetCoordinates();
    };

    render() {
        let myStyle;

        //als er is geklikt
        if (this.props.coordinates) {
            //kijk wat de geklikte coordinaten zijn op het scherm
            let top = this.props.coordinates.y;
            let left = this.props.coordinates.x;

            //kijk of de component zal passen op het scherm
            if ((this.state.widthPage - left) < this.state.xMenu) {
                //anders verplaats het naar link totdat het wel pasts
                left = this.state.widthPage - this.state.xMenu;
            }

            //zelfde met hoogte
            if ((this.state.heightPage - top) < this.state.yMenu) {
                top = this.state.heightPage - this.state.yMenu;
            }

            // - 10 zodat de gebruiker altijd over de component heen hovert als deze geopend wordt
            myStyle = {
                position: 'absolute',
                top: `${top - 10}px`,
                left: `${left - 10}px`,
                display: "block",
            };
        } else {
            //als iemand niet heeft geklikt laat deze component weg
            myStyle = {
                display: "none",
            };
        }

        //voor elk element crëer een optie
        let elements = this.props.objectsOverLayedOnMap.map(res => {
            return (<p key={res.head + res.sub + res.subColor} onClick={() => {
                this.onClick(res.onClick);
            }}>
                <b>{res.head} </b>
                <span
                    style={{color: this.props.getHexFromColor(res.subColor, true)}}>{res.sub}</span>
            </p>);
        });

        //geef de component terug.
        //als de gebruiker van de component af gaat, laat deze dan verdwijnen. zie onMouseLeave.
        return (<div style={myStyle}
                     className="contextMenuContainer"
                     ref={(div) => {this.div = div}}
                     onMouseLeave={() => {
                         this.props.resetCoordinates();
                     }}
                     onContextMenu={(e) => {
                         e.preventDefault();
                     }}>
            {elements}
        </div>)
    }
}

export default ContextMenu;