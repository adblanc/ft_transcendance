import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import moment from "moment";

type Options = Backbone.ViewOptions & { model: War};

export default class NodeView extends BaseView {
  model: War;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  render() {
	const war = {
		...this.model.toJSON(),
		start: moment(this.model.get("start")).format(
			"MMM Do YY"
		),
		end: moment(this.model.get("end")).format(
		  "MMM Do YY"
		),
	};

    const template = $("#warNodeTemplate").html();
    const html = Mustache.render(template, war);
	this.$el.html(html);

    return this;
  }
}
