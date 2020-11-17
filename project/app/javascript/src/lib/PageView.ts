import Messages from "src/collections/Messages";
import { eventBus } from "src/events/EventBus";
import Message from "src/models/Message";
import ChatView from "src/views/Chat/ChatView";
import BaseView from "./BaseView";

export default class PageView extends BaseView {
  chatView?: BaseView;
  messages?: Messages;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.messages = new Messages();

    this.listenTo(eventBus, "chat:open", () => {
      if (!this.chatView) {
        this.renderChat();
      } else {
        this.chatView.close();
        this.chatView = undefined;
      }
    });
  }

  renderChat() {
    this.chatView = new ChatView({
      collection: this.messages,
    });

    $("#container").append(this.chatView.render().el);

    this.chatView.collection.reset();

    this.chatView.collection.add(
      new Message({
        avatar_url:
          "https://cdn.shopify.com/s/files/1/0240/3441/0601/products/135.png?v=1598373418",
        content: "a".repeat(150),
        type: "received",
      })
    );
    this.chatView.collection.add(
      new Message({
        avatar_url:
          "https://cdn.shopify.com/s/files/1/0240/3441/0601/products/135.png?v=1598373418",
        content: "b".repeat(150),
        type: "sent",
      })
    );
    this.chatView.collection.add(
      new Message({
        avatar_url:
          "https://cdn.shopify.com/s/files/1/0240/3441/0601/products/135.png?v=1598373418",
        content: "a".repeat(150),
        type: "received",
      })
    );
    this.chatView.collection.add(
      new Message({
        avatar_url:
          "https://cdn.shopify.com/s/files/1/0240/3441/0601/products/135.png?v=1598373418",
        content: "b".repeat(150),
        type: "sent",
      })
    );
  }
}
