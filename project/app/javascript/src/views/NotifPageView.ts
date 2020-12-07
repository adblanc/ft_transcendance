import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Profile from "src/models/Profile";
import Notification from "src/models/Notification";
import NotificationView from "./NotificationView";


export default class NotifPageView extends BaseView {
	profile: Profile;

  constructor() {
	super();
	
	this.profile = new Profile();
	this.profile.fetch();

	this.listenTo(this.profile.notifications, "add", this.render);
  }
  

  render() {
	const template = $("#notifPageTemplate").html();
	const html = Mustache.render(template, {});
	this.$el.html(html);

	const $element = this.$("#listing");

	if (this.profile.notifications.length === 0) {
		this.$('#empty').show();
	}

    this.profile.notifications.forEach(function (item) {
      var notificationView = new NotificationView({
        notification: item,
      });
	  $element.prepend(notificationView.render().el);
	});

    return this;
  }
}
