import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Tournament from "src/models/Tournament";
import moment from "moment";

type Options = Backbone.ViewOptions & { model: Tournament };

export default class TourListView extends BaseView {
  model: Tournament;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  render() {
	const tour = {
		...this.model.toJSON(),
		registration_start: moment(this.model.get("registration_start")).format(
			"MMM Do YY, h:mm a"
		),
		registration_end: moment(this.model.get("registration_end")).format(
		  "MMM Do YY, h:mm a"
		),
	};

    const template = $("#tourListTemplate").html();
    const html = Mustache.render(template, {
		tour : tour,
		open : this.model.get("status") == "registration"
	});
	this.$el.html(html);

    return this;
  }
}
