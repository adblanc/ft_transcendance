import Backbone from "backbone";
import Mustache from "mustache";
import Messages from "src/collections/Messages";
import { eventBus } from "src/events/EventBus";
import Message from "src/models/Message";
import BaseView from "./BaseView";
import ChatView from "./Chat/ChatView";
import NavbarView from "./NavbarView";
import BoardView from "./guild/BoardView";

export default class IndexView extends BaseView {
  navbarView: Backbone.View;
  boardView: Backbone.View;
  chatView: BaseView;
  chatOpen: boolean;
  messages: Backbone.Collection;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.chatOpen = false;

	this.navbarView = new NavbarView();
	this.boardView = new BoardView();

    this.messages = new Messages();

    this.listenTo(eventBus, "chat:open", () => {
      if (!this.chatOpen) {
        this.chatOpen = true;
        this.renderChat();
      } else {
        this.chatOpen = false;
        this.chatView.close();
      }
    });
  }

  render() {
    const template = $("#indexPageTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	this.renderNested(this.navbarView, "#index-navbar");
	this.renderNested(this.boardView, "#board");

    return this;
  }

  renderChat() {
    this.chatView = new ChatView({
      collection: this.messages,
    });
    this.appendNested(this.chatView, "#index-chat");

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
