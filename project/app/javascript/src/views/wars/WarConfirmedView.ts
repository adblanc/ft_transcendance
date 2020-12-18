import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import Guild from "src/models/Guild";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { war: War};

export default class WarConfirmedView extends BaseView {
	war: War;

  constructor(options?: Options) {
    super(options);

	this.war = options.war;

	this.listenTo(this.war, "change", this.render);
	//console.log("test");
  }

  render() {
	const template = $("#confirmedWarTemplate").html();
    const html = Mustache.render(template, this.war.toJSON());
	this.$el.html(html);

    return this;
  }
}