import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Notification from "src/models/Notification";
import moment from "moment";

type Options = Backbone.ViewOptions & { notification: Notification };

export default class ItemView extends BaseView {
  notification: Notification;
  momentString: string;

  constructor(options?: Options) {
    super(options);

	this.notification = options.notification;

	this.listenTo(this.notification, "change", this.render);

	//let dateString = this.notification.get("created_at");
	//this.momentString = moment(dateString).format("MMM Do YY, h:mm a");

  }

  render() {
	const notif = {
		...this.notification.toJSON(),
		created_at: moment(this.notification.get("created_at")).format("MMM Do YY, h:mm a"),
		notifiable_type: this.notification.get("notifiable_type").toLowerCase(),
	};

	console.log(notif);

    const template = $("#notifTemplate").html();
    const html = Mustache.render(template, notif);
	this.$el.html(html);

	//this.$('#time').html(this.momentString);
	//this.$('#content').attr('href', `/${this.notification.get('notifiable_type').toLowerCase()}/${this.notification.get('notifiable_id')}`);

    return this;
  }
}