import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../../lib/BaseView";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions & { guild: Backbone.AssociatedModel };

export default class MembersView extends Backbone.View {
  guild: Backbone.AssociatedModel;

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
