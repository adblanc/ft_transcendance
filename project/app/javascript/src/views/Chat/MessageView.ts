import Backbone from "backbone";
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
    const template = _.template($("#message-template").html());
    this.$el.html(template(this.model.toJSON()));

    return this;
  }
}
