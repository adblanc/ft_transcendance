import Backbone from "backbone";
import Mustache from "mustache";
import Profile from "../models/Profile";
import ProfileView from "./ProfileView";
import { clearAuthHeaders } from "../utils/auth";
import BaseView from "../lib/BaseView";
import { eventBus } from "src/events/EventBus";

type Options = Backbone.ViewOptions & { profile: Profile };

export default class NavbarView extends BaseView {
  profile: Profile;
  profileView: Backbone.View;

	constructor(options?: Options) {
		super(options);
		
	this.profile = options.profile;

	this.profileView = new ProfileView({
		model: this.profile,
	  });

	this.listenTo(this.profile.notifications, "add", this.render);
	this.listenTo(this.profile.notifications, "change", this.render);
	
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
	this.profile.channel.unsubscribe();
	Backbone.history.navigate("/auth", { trigger: true });
  }

  onClickMessage() {
    eventBus.trigger("chat:open");
  }

  onClickNotification() {
	eventBus.trigger("notifications:open");
	this.profile.notifications.forEach(function (item) {
		if (!item.get("read_at")) {
			item.markAsRead();
		}
	});
  }

  render() {
    const template = $("#navbarTemplate").html();
    const html = Mustache.render(template, this.profile.toJSON());
	this.$el.html(html);
	
	const $element = this.$("#unread");
	$element.replaceWith(`${this.profile.notifications.getUnreadNb()}`);

    this.renderNested(this.profileView, "#nav-profile");

    return this;
  }
}
