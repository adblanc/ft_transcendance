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

	this.listenTo(this.profile.notifications, "add", this.renderNotif);
  }

  renderNotif(notification: Notification) {
    this.$el.append(new NotificationView({ notification: notification }).render().el);

      this.render();
  }
  

  render() {
	$("#notificationsTemplate").html(this.$el.html());

    return this;
  }
}
