import L from "leaflet";
import MarkerGold from "../assets/GoldMarker.png";
import MarkerShadow from "../assets/marker-shadow.png";

//
// export const GoldIcon = L.icon({
//     iconUrl: MarkerGold,
//     iconAnchor: [12, 41],
//     iconRetinaUrl: MarkerGold,
//     iconSize: [25, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41],
//     shadowUrl: MarkerShadow,
//     tooltipAnchor: [16, -28]
// });

export const GoldIcon = new L.Icon.Default({
    iconUrl: MarkerGold,
    iconRetinaUrl : MarkerGold,
    imagePath: " ",
    shadowUrl : MarkerShadow});
export const DefaultIcon = new L.Icon.Default();
