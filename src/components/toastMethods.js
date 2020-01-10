import {toast} from "react-toastify";

export function toastMax() {
    toast('Niet alle resultaten worden getoond', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        className: 'toast-background',
        progressClassName: 'toast-progress-bar'
    });
}