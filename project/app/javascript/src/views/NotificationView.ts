import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../lib/BaseView";
import Notification from "src/models/Notification";

type Options = Backbone.ViewOptions & { model: Notification };

export default class ItemView extends BaseView {
  model: Notification;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  render() {
    const template = $("#notifTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);

    return this;
  }
}
