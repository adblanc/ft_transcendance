import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Notification from "src/models/Notification";

type Options = Backbone.ViewOptions & { notification: Notification };

export default class ItemView extends BaseView {
  notification: Notification;

  constructor(options?: Options) {
    super(options);

	this.notification = options.notification;

	this.listenTo(this.notification, "change", this.render);
  }

  render() {
    const template = $("#notifTemplate").html();
    const html = Mustache.render(template, this.notification.toJSON());
	this.$el.html(html);

    return this;
  }
}
