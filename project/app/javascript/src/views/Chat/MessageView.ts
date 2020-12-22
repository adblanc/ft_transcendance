import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import Message from "src/models/Message";
import _ from "underscore";

export default class MessageView extends Backbone.View<Message> {
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Message model.");
    }
  }

  events() {
    return {
      "click .user-avatar": () =>
        eventBus.trigger("chat:profile-clicked", this.model),
    };
  }

  render() {
    const template = $("#message-template").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}
