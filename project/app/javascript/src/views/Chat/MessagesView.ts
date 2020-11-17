import Mustache from "mustache";
import Message from "src/models/Message";
import BaseView from "../../lib/BaseView";
import MessageView from "./MessageView";

export default class MessagesView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.verifyCollectionExists();

    this.listenTo(this.collection, "add", this.onAddMessage);
    this.listenTo(this.collection, "remove", this.onRemoveMessage);
  }

  onAddMessage(message: Message) {
    console.log("add message");
    const view = new MessageView({
      model: message,
    });
    const el = view.render().$el;

    this.$("#chat-messages-container").append(el);
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
