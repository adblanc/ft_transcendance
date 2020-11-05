import Backbone from "backbone";
import Mustache from "mustache";
import $ from "jquery";
import { get42LoginUrl } from "../utils/api";

export default class AuthView extends Backbone.View {
    constructor(options?: Backbone.ViewOptions) {
        super(options);
    }

    render() {
        const template = $("#loginTemplate").html();
        const html = Mustache.render(template, {
            "42_LOGIN_URL": get42LoginUrl()
        });
        this.$el.html(html);
        return this;
    }
}
