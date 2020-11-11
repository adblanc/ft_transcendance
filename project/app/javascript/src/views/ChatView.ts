import Mustache from "mustache";
import BaseView from "./BaseView";
import Message from "src/models/Message";
import MessageView from "./MessageView";

export default class ChatView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.listenTo(this.collection, "add", this.onAddMessage);
    this.listenTo(this.collection, "remove", this.onRemoveMessage);
  }

  onClose() {}

  events() {
    return {
      "keypress #input-message": "onKeyPressInput",
    };
  }

  onKeyPressInput() {
    console.log("key pressed");
  }

  onAddMessage(message: Message) {
    console.log("add message");
    const view = new MessageView({
      model: message,
    });
    const el = view.render().$el;

    this.$("#messages-container").append(el);
  }

  onRemoveMessage() {
    console.log("remove message");
  }

  render() {
    const template = $("#chatTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
