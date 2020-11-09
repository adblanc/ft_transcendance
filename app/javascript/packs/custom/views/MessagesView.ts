import Mustache from "mustache";
import Message from "../models/Message";
import BaseView from "./BaseView";
import MessageView from "./MessageView";

export default class MessagesView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.collection.on("add", this.onAddMessage, this);
    this.collection.on("remove", this.onRemoveMessage, this);
  }

  onAddMessage(message: Message) {
    console.log("add message", message.toJSON());

    const view = new MessageView({
      model: message,
    });

    console.log(this.$("#messages-container"));

    const el = view.render().$el;

    console.log(el);

    this.$("#messages-container").append(el);
  }

  onRemoveMessage() {
    console.log("remove message");
  }

  render() {
    const template = $("#messagesTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
