import Messages from "src/collections/Messages";
import { eventBus } from "src/events/EventBus";
import Message from "src/models/Message";
import ChatView from "src/views/Chat/ChatView";
import NotificationsView from "src/views/NotificationsView";
import Notifications from "src/collections/Notifications";
import BaseView from "./BaseView";

export default class PageView extends BaseView {
  chatView?: BaseView;
  notificationsView?: BaseView;
  messages?: Messages;
  notifications?: Notifications;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

	this.messages = new Messages();
	this.notifications = new Notifications();
	this.notifications.fetch();

    this.listenTo(eventBus, "chat:open", () => {
      if (!this.chatView) {
        this.renderChat();
      } else {
        this.chatView.close();
        this.chatView = undefined;
      }
	});
	
	this.listenTo(eventBus, "notifications:open", () => {
		if (!this.notificationsView) {
		  this.renderNotifications();
		} else {
		  this.notificationsView.close();
		  this.notificationsView = undefined;
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

  renderNotifications() {
    this.notificationsView = new NotificationsView({
      notifications: this.notifications,
	});

    $("#container").append(this.notificationsView.render().el);

  }
}
