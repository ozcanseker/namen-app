import React from 'react';
import './style/ContextMenu.scss'

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
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({widthPage: window.innerWidth, heightPage: window.innerHeight});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.yMenu !== this.div.clientHeight || this.state.xMenu !== this.div.clientWidth){
            this.setState({
                yMenu :  this.div.clientHeight,
                xMenu : this.div.clientWidth
            });
        }
    }

    render() {
        let myStyle;

        if (this.props.coordinates) {

            let top = this.props.coordinates.y;
            let left = this.props.coordinates.x;

            if ((this.state.widthPage - left) < this.state.xMenu) {
                left = this.state.widthPage - this.state.xMenu;
            }

            if ((this.state.heightPage - top) < this.state.yMenu) {
                top = this.state.heightPage - this.state.yMenu;
            }

            myStyle = {
                position: 'absolute',
                top: `${top - 10}px`,
                left: `${left - 10}px`,
                display: "block",
            };
        } else {
            myStyle = {
                display: "none",
            };
        }

        let elements = this.props.objectsOverLayedOnMap.map(res => {
            return (<p key={res.head + res.sub + res.subColor} onClick={res.onClick}>
                <b>{res.head} </b>
                <span
                    style={{color: this.props.getHexFromColor(res.subColor, true)}}>{res.sub}</span>
            </p>);
        });

        return (<div style={myStyle}
                     className="contextMenuContainer"
                     ref={(div) => {this.div = div}}
                     onMouseEnter={() => {
                         this.setState({mousedOver: true})
                     }}
                     onMouseLeave={() => {
                         this.props.resetCoordinates();
                     }}
        >
            {elements}
        </div>)
    }
}

export default ContextMenu;