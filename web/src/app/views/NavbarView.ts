import Backbone from "backbone";
import Mustache from "mustache";
import $ from "jquery";
import Profile from "../models/Profile";
import ProfileView from "./ProfileView";
import { clearAuthHeaders } from "../utils/auth";

export default class NavbarView extends Backbone.View {
    constructor(options?: Backbone.ViewOptions) {
        super(options);
    }

    events() {
        return {
            "click #btn-logout": "onLogout"
        };
    }

    onLogout() {
        console.log("logout");
        clearAuthHeaders();
        this.renderProfile(); // to fetch profile and therefore get a 401 and get redirected to login page
    }

    render() {
        const template = $("#navbarTemplate").html();
        const html = Mustache.render(template, {});
        this.$el.html(html);

        this.renderProfile();

        return this;
    }

    renderProfile() {
        const profile = new Profile();
        const profileView = new ProfileView({
            model: profile,
            el: "#nav-profile"
        });
        profile.fetch();
        profileView.render();
    }
}
