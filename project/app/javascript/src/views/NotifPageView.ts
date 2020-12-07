import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Profile from "src/models/Profile";
import Notification from "src/models/Notification";
import NotifItemPageView from "./NotifItemPageView";
import Notifications from "src/collections/Notifications";


export default class NotifPageView extends BaseView {
	profile: Profile;
	notifications: Notifications;

  constructor() {
	super();
	
	this.profile = new Profile();

	this.listenTo(this.notifications, "add", this.render);
  }
  

  render() {
	const template = $("#notifPageTemplate").html();
	const html = Mustache.render(template, {});
	this.$el.html(html);

	const $element = this.$("#listing");

	this.profile.fetch({
		success: () => {
			this.notifications = this.profile.get('notifications');
			if (this.notifications.length === 0) {
				this.$('#empty').show();
			}
		
			this.notifications.forEach(function (item) {
				var notificationView = new NotifItemPageView({
				  notification: item,
				});
				$element.append(notificationView.render().el);
			  });
		},
	});

    return this;
  }
}
