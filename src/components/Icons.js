import L from "leaflet";
import MarkerGold from "../assets/GoldMarker.png";
import MarkerShadow from "../assets/marker-shadow.png";



export const Icons = new L.Icon.Default({
    iconUrl: MarkerGold,
    iconRetinaUrl : MarkerGold,
    imagePath: " ",
    shadowUrl : MarkerShadow});
export const DefaultIcon = new L.Icon.Default();
