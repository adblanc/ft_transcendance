import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";
import Members from "src/collections/Members";
import Guild from "src/models/Guild";

export default class MembersView extends Backbone.View<Guild> {
  members: Backbone.Collection;

  constructor(options?: Backbone.ViewOptions<Guild>) {
    super(options);

	this.members = new Members();
	this.listenTo(this.model, "change", this.render);
  }

  render() {
    const template = $("#membersTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}