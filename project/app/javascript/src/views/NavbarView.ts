import Backbone from "backbone";
import Mustache from "mustache";
import Profile from "../models/Profile";
import ProfileView from "./ProfileView";
import { clearAuthHeaders } from "../utils/auth";
import BaseView from "../lib/BaseView";
import { eventBus } from "src/events/EventBus";
import Notifications from "src/collections/Notifications";

export default class NavbarView extends BaseView {
  profileView: Backbone.View;
  notifications?: Notifications;

  constructor() {
    super();

    const profile = new Profile();
    this.profileView = new ProfileView({
      model: profile,
	});
	profile.fetch();

	this.notifications = new Notifications();
	this.listenTo(this.notifications, "reset", this.render);
	this.listenTo(this.notifications, "change", this.render);
	
  }

  events() {
    return {
	  "click #btn-logout": "onLogout",
	  "click #btn-notifications": "onClickNotification",
      "click #btn-messages": "onClickMessage",
      "click #navbar-brand": "onBrandClick",
    };
  }

  onBrandClick() {
    Backbone.history.navigate("/", { trigger: true });
  }

  onLogout() {
    clearAuthHeaders();
    Backbone.history.navigate("/auth", { trigger: true });
  }

  onClickMessage() {
    eventBus.trigger("chat:open");
  }

  onClickNotification() {
	eventBus.trigger("notifications:open");
	this.render();
  }

  render() {
    const template = $("#navbarTemplate").html();
    const html = Mustache.render(template, this.notifications.toJSON());
	this.$el.html(html);
	
	const $element = this.$("#unread");

	this.notifications.fetch({
		success: () => {
			  $element.replaceWith(`${this.notifications.length}`);
		},
	});

    this.renderNested(this.profileView, "#nav-profile");

    return this;
  }
}
