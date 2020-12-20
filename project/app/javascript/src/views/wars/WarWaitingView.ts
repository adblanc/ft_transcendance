import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import Guild from "src/models/Guild";
import { displaySuccess } from "src/utils";
import moment from "moment";

type Options = Backbone.ViewOptions & { war: War, guild: Guild};

export default class WarWaitingView extends BaseView {
	war: War;
	guild: Guild;
	opponent: Guild;

  constructor(options?: Options) {
    super(options);

	this.war = options.war;
	this.guild = options.guild;

	this.listenTo(this.war, "change", this.render);
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

	var id = this.guild.get("warOpponent").get("id");

	const template = $("#warWaitingTemplate").html();
	const html = Mustache.render(template, { 
		war: war,
		img: this.guild.get("warOpponentImg"),
		name: this.guild.get("warOpponent").get("name"),
		url: `/guild/${this.guild.get("warOpponent").get("id")}`,
	});
	this.$el.html(html);

    return this;
  }
}