import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Profile from "src/models/Profile";
import Notification from "src/models/Notification";
import NotificationView from "./NotificationView";


type Options = Backbone.ViewOptions & { profile: Profile };

export default class NotificationsView extends BaseView {
  profile: Profile;

  constructor(options?: Options) {
	super(options);
	
	this.profile = options.profile;

	this.listenTo(this.profile.notifications, "add", this.render);
  }

  events() {
    return {
	  "click #see-btn": "onSeeClicked",
    };
  }

  onSeeClicked() {
	this.$el.toggleClass("invisible");
  }

  render() {
	const template = $("#notificationsTemplate").html();
	const html = Mustache.render(template, {});
	this.$el.html(html);

	const $element = this.$("#notifications-container");

	if (this.profile.notifications.length === 0) {
		this.$('#empty').show();
		this.$('#see-btn').hide();
	}

    this.profile.notifications.slice(this.profile.notifications.length - 5, this.profile.notifications.length).forEach(function (item) {
      var notificationView = new NotificationView({
		notification: item,
		page: false,
      });
	  $element.prepend(notificationView.render().el);
	});

    return this;
  }
}
