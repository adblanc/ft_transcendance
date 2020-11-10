import Backbone from "backbone";
import Mustache from "mustache";
import Profile from "../models/Profile";
import ProfileView from "./ProfileView";
import { clearAuthHeaders } from "../utils/auth";
import BaseView from "./BaseView";

export default class NavbarView extends BaseView {
  profileView: Backbone.View;

  constructor() {
    super();

    const profile = new Profile();
    this.profileView = new ProfileView({
      model: profile,
    });
    profile.fetch();
  }

  events() {
    return {
      "click #btn-logout": "onLogout",
    };
  }

  onLogout() {
    clearAuthHeaders();
    Backbone.history.navigate("/auth", { trigger: true });
  }

  render() {
    const template = $("#navbarTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.renderNested(this.profileView, "#nav-profile");

    return this;
  }
}
