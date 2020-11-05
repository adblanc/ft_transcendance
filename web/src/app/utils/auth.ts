import Backbone from "backbone";

const BackboneAjax = Backbone.ajax;

export const addAuthHeaders = (token: string) => {
    console.log("we had header", `Authorization: ${`Bearer ${token}`}`);
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
};
