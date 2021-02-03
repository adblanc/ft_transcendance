import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Tournament from "src/models/Tournament";

type Options = Backbone.ViewOptions & { model: Tournament };

export default class TourListView extends BaseView {
  model: Tournament;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  render() {
    const template = $("#tourListTemplate").html();
    const html = Mustache.render(template, {
		tour : this.model.toJSON(),
		open : this.model.get("status") == "registration"
	});
	this.$el.html(html);

    return this;
  }
}
