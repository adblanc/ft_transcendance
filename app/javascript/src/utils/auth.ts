import Backbone from "backbone";

const BackboneAjax = Backbone.ajax;

export const addAuthHeaders = (token: string) => {
    if (process.env.NODE_ENV === "development") {
        localStorage.setItem("tokenAuth", token);
    }
    Backbone.ajax = function (options) {
        return BackboneAjax({
            ...options,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };
};

export const clearAuthHeaders = () => {
    Backbone.ajax = BackboneAjax;

    if (process.env.NODE_ENV === "development") {
        localStorage.clear();
    }
};
