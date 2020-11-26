import Messages from "src/collections/Messages";
import { eventBus } from "src/events/EventBus";
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
    $("#container").append("chat");
  }
}
