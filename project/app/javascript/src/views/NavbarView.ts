import Backbone from "backbone";
import Mustache from "mustache";
import Profile from "../models/Profile";
import ProfileView from "./ProfileView";
import { clearAuthHeaders } from "../utils/auth";
import BaseView from "../lib/BaseView";
import { eventBus } from "src/events/EventBus";
import Notifications from "src/collections/Notifications";

type Options = Backbone.ViewOptions & { notifications: Notifications };

export default class NavbarView extends BaseView {
  profileView: Backbone.View;
  notifications: Notifications;

  constructor(options?: Options) {
    super(options);

	this.notifications = options.notifications;

    const profile = new Profile();
    this.profileView = new ProfileView({
      model: profile,
	});
	profile.fetch();

	this.listenTo(this.notifications, "reset", this.render);
	this.listenTo(this.notifications, "update", this.render);
	
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
	this.notifications.forEach(function (item) {
		item.markAsRead();
	  });
	//this.render();
  }

  render() {
    const template = $("#navbarTemplate").html();
    const html = Mustache.render(template, this.notifications.toJSON());
	this.$el.html(html);
	
	const $element = this.$("#unread");
	$element.replaceWith(`${this.notifications.length}`);

	/*this.notifications.fetch({
		success: () => {
			  $element.replaceWith(`${this.notifications.length}`);
		},
	});*/

    this.renderNested(this.profileView, "#nav-profile");

    return this;
  }
}
