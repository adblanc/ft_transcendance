import Backbone from "backbone";

const BackboneAjax = Backbone.ajax;

export const addAuthHeaders = (headers: Record<"Authorization", string>) => {
    Backbone.ajax = function (options) {
        return BackboneAjax({ ...options, headers });
    };
};

export const clearAuthHeaders = () => {
    Backbone.ajax = BackboneAjax;
};
