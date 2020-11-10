import Backbone from "backbone";
import Mustache from "mustache";
import Profile from "../models/Profile";
import ProfileView from "./ProfileView";
import { clearAuthHeaders } from "../utils/auth";
import BaseView from "./BaseView";
import { eventBus } from "src/events/EventBus";

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
      "click #btn-messages": "onClickMessage",
    };
  }

  onLogout() {
    clearAuthHeaders();
    Backbone.history.navigate("/auth", { trigger: true });
  }

  onClickMessage() {
    eventBus.trigger("chat:open");
  }

  render() {
    const template = $("#navbarTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.renderNested(this.profileView, "#nav-profile");

    return this;
  }
}
