import Backbone from "backbone";
import Mustache from "mustache";
import $ from "jquery";
import Profile from "../models/Profile";

export default class ProfileView extends Backbone.View<Profile> {
    constructor(options?: Backbone.ViewOptions<Profile>) {
        super(options);

        this.model.on("change", this.render, this);
    }

    render() {
        const template = $("#profileTemplate").html();
        const html = Mustache.render(template, this.model.toJSON());
        this.$el.html(html);
        return this;
    }
}
