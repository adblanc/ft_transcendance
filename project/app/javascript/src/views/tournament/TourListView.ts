import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Tournament from "src/models/Tournament";
import moment from "moment";

type Options = Backbone.ViewOptions & { model: Tournament, mine: boolean };

export default class TourListView extends BaseView {
  model: Tournament;
  mine: boolean;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
	this.mine = options.mine;
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
		open : this.model.get("status") == "registration",
		mine: this.mine,
	});
	this.$el.html(html);

    return this;
  }
}
