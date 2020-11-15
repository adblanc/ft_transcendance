import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions & {guild: Backbone.Model};

export default class MembersView extends Backbone.View {
	guild: Backbone.Model;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;

	this.listenTo(this.guild, "change", this.render);
  }

  render() {
    const template = $("#membersTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}