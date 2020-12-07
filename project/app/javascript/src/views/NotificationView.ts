import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Notification from "src/models/Notification";

type Options = Backbone.ViewOptions & { notification: Notification };

export default class ItemView extends BaseView {
  notification: Notification;
  momentString: string;

  constructor(options?: Options) {
    super(options);

	this.notification = options.notification;

	console.log(this.notification);

	this.listenTo(this.notification, "change", this.render);

	const moment = require("moment");

	let dateString = this.notification.get("created_at");
	this.momentString = moment(dateString).format("MMM Do YY, h:mm a");

  }

  render() {
    const template = $("#notifTemplate").html();
    const html = Mustache.render(template, this.notification.toJSON());
	this.$el.html(html);

	$('#time').html(this.momentString);
	$('#content').attr('href', `/${this.notification.get('notifiable_type').toLowerCase()}/${this.notification.get('notifiable_id')}`);

    return this;
  }
}