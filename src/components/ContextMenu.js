import React from 'react';
import './style/ContextMenu.scss'

/**
 * Dit is het menu dat tervoorschijn komt als je op de kaart klikt met meerdere lagen.
 */
class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mousedOver: false,
            widthPage: 0,
            heightPage: 0,
        }
    }

    componentDidMount() {
        //Kijk wat de hoogte en breedte is van de pagina wanneer deze component tevoorschijn komt.
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        //Unmount de listener als de applicatie sluit
        window.removeEventListener('resize', this.updateWindowDimensions);
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

            if ((this.state.heightPage - top) < this.state.yMenu) {
                top = this.state.heightPage - this.state.yMenu;
            }

            //de -10 is ervoor, als de gebruiker klikt zal deze altijd over de applicatie heen gaan.
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
            return (<p key={res.head + res.sub + res.subColor} onClick={res.onClick}>
                <b>{res.head} </b>
                <span
                    style={{color: this.props.getHexFromColor(res.subColor, true)}}>{res.sub}</span>
            </p>);
        });

        //geef de compoenent terug.
        //als de gebruiker van de component af gaat, laat deze dan verdwijnen. zie onMouseLeave.
        return (<div style={myStyle}
                     className="contextMenuContainer"
                     ref={(div) => {this.div = div}}
                     onMouseEnter={() => {
                         this.setState({mousedOver: true})
                     }}
                     onMouseLeave={() => {
                         this.props.resetCoordinates();
                     }}
                     onContextMenu={(e) => {
                         e.preventDefault();
                     }}
        >
            {elements}
        </div>)
    }
}

export default ContextMenu;