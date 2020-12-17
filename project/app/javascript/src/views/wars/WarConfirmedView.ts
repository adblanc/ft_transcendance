import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import Guild from "src/models/Guild";
import { displaySuccess } from "src/utils";

//or maybe pass a guild
type Options = Backbone.ViewOptions & { war: War};

export default class WarConfirmedView extends BaseView {
	war: War;

  constructor(options?: Options) {
    super(options);

	this.war = options.war;
  }

  render() {
	const template = $("#myWarTemplate").html();
    const html = Mustache.render(template, this.war.toJSON()); //replace with this.war if it exists and if confirmed
	this.$el.html(html);

    return this;
  }
}