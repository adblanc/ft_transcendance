import Backbone from "backbone";
import Mustache from "mustache";
import Message from "src/models/Message";
import _ from "underscore";

export default class MessageView extends Backbone.View<Message> {
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Message model.");
    }
  }

  render() {
    const template = $("#message-template").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}
