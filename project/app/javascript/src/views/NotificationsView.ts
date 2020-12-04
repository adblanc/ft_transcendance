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


	console.log(this.profile.notifications);

	this.listenTo(this.profile.notifications, "add", this.render);
  }

  /*renderNotif(notification: Notification) {
    this.$el.append(new NotificationView({ notification: notification }).render().el);

      this.render();
  }*/
  

  render() {
	const template = $("#notificationsTemplate").html();
	const html = Mustache.render(template, {});
	this.$el.html(html);

	const $element = this.$("#notifications-container");

    this.profile.notifications.forEach(function (item) {
      var notificationView = new NotificationView({
        notification: item,
      });
	  $element.append(notificationView.render().el);
	});

    return this;
  }
}

/*render() {
    const template = $("#notificationsTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);

    const $element = this.$("#notifications-container");

    this.notifications.forEach(function (item) {
      var notificationView = new NotificationView({
        model: item,
      });
	  $element.append(notificationView.render().el);
	});

    return this;
  }*/