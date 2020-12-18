import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import Guild from "src/models/Guild";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { war: War};

export default class WarWaitingView extends BaseView {
	war: War;

  constructor(options?: Options) {
    super(options);

	this.war = options.war;
	this.listenTo(this.war, "change", this.render);
  }

  render() {
	const template = $("#warWaitingTemplate").html();
    const html = Mustache.render(template, this.war.toJSON()); //replace with this.war if it exists and if confirmed
	this.$el.html(html);

    return this;
  }
}