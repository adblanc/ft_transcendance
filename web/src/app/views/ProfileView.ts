import Backbone from "backbone";
import Mustache from "mustache";
import $ from "jquery";
import Profile from "../models/Profile";
import ModifyProfileView from "./ModifyProfileView";

export default class ProfileView extends Backbone.View<Profile> {
    constructor(options?: Backbone.ViewOptions<Profile>) {
        super(options);

        this.model.on("change", this.render, this);
    }

    events() {
        return {
            "click #btn-profile": "onProfileClicked"
        };
    }

    onProfileClicked() {
        console.log("profile clicked");
        const modifyProfileView = new ModifyProfileView({
            model: this.model
        });

        modifyProfileView.render();
    }

    render() {
        const template = $("#profileTemplate").html();
        const html = Mustache.render(template, this.model.toJSON());
        this.$el.html(html);

        $("#nav-profile").html(this.el);
        return this;
    }
}
