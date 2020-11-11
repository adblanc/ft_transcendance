declare module "toastify-js" {
    interface Offset {
        x: number | string;
        y: number | string;
    }

    export interface ToastArgs {
        text?: string;
        node?: Node;
        duration?: number;
        selector?: string;
        destination?: string;
        newWindow?: boolean;
        close?: boolean;
        gravity?: "top" | "bottom";
        position?: "left" | "center" | "right";
        backgroundColor?: string;
        stopOnFocus?: boolean;
        className?: string;
        offset?: Offset;
        onClick?: () => void;
    }

    export default function Toastify(
        args?: ToastArgs
    ): {
        showToast: () => void;
    };
}
