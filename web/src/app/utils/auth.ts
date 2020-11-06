import Backbone from "backbone";

const BackboneAjax = Backbone.ajax;

export const addAuthHeaders = (token: string) => {
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
