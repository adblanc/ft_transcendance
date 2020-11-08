import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { random } from "underscore";

const ERRORS_COLORS = [
    "linear-gradient(90deg, rgba(247,122,16,1) 30%, rgba(255,0,46,1) 100%)",
    "linear-gradient(to right, #525252, #3d72b4)",
    "linear-gradient(to right, #7b4397, #dc2430)",
    "linear-gradient(to right, #2c3e50, #fd746c)",
    "linear-gradient(to right, #e96443, #904e95)",
    "linear-gradient(to right, #1d4350, #a43931)",
    "linear-gradient(to right, #000000, #434343)",
    "linear-gradient(to right, #4b79a1, #283e51)"
];

const SUCCESS_COLORS = [
    "linear-gradient(to right, #11998e, #38ef7d)",
    "linear-gradient(to right, #67b26f, #4ca2cd)",
    "linear-gradient(to right, #1d976c, #93f9b9)"
];

type ToastArgs = Parameters<typeof Toastify>[0];
type ToastType = "success" | "error";

const getRandomToastColor = (type: ToastType) => {
    switch (type) {
        case "success":
            return SUCCESS_COLORS[random(SUCCESS_COLORS.length - 1)];
        case "error":
            return ERRORS_COLORS[random(ERRORS_COLORS.length - 1)];
        default:
            throw Error("Provide a toast type.");
    }
};

export const displayToast = (args: ToastArgs, type: ToastType) => {
    Toastify({
        backgroundColor: getRandomToastColor(type),
        ...args
    }).showToast();
};
