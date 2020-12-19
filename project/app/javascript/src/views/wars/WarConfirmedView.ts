import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import Guild from "src/models/Guild";
import { displaySuccess } from "src/utils";
import moment from "moment";

type Options = Backbone.ViewOptions & { war: War,  opponent_id: number};

export default class WarConfirmedView extends BaseView {
	war: War;
	opponent_id: number;
	index: number;

  constructor(options?: Options) {
    super(options);

	this.war = options.war;
	this.opponent_id = options.opponent_id;

	this.listenTo(this.war, "change", this.render);
	
	var tmp = 0;
	this.war.get("guilds").forEach(function (item) {
		if (item.get("id") == this.opponent_id) {
			this.index = tmp;
		}
		tmp++;
	}, this);

  }

  render() {
	const war = {
		...this.war.toJSON(),
		start: moment(this.war.get("start")).format(
			"MMM Do YY, h:mm a"
		),
		end: moment(this.war.get("end")).format(
		  "MMM Do YY, h:mm a"
		)
	};

	const template = $("#confirmedWarTemplate").html();
	const html = Mustache.render(template, { 
		war: war,
		img: this.war.get("guilds").at(this.index).get("img_url"),
		url: `/guild/${this.opponent_id}`,
		name: this.war.get("guilds").at(this.index).get("name")
	});
	this.$el.html(html);

    return this;
  }
}