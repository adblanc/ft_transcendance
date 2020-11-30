import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Notifications from "src/collections/Notifications";
import NotificationView from "./NotificationView";


type Options = Backbone.ViewOptions & { notifications: Notifications };

export default class NotificationsView extends BaseView {
  notifications: Notifications;

  constructor(options?: Options) {
	super(options);
	
	this.notifications = options.notifications;

	this.listenTo(this.notifications, "reset", this.render);
    this.listenTo(this.notifications, "change", this.render);
	
	console.log(this.notifications);
	console.log(this.notifications.length);
  
  }
  

  render() {
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
  }
}
