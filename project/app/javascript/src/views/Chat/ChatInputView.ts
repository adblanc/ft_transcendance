import Backbone from "backbone";
import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import BaseView from "src/lib/BaseView";
import Message from "src/models/Message";
import _ from "underscore";

type Options = Backbone.ViewOptions & {
  rooms: Rooms;
};

export default class ChatInputView extends BaseView {
  rooms: Rooms;

  constructor(options?: Options) {
    super(options);

    this.rooms = options.rooms;
  }

  events() {
    return {
      "keypress #send-message-input": this.onKeyPress,
      "click #send-message-btn": this.sendMessage,
    };
  }

  onKeyPress(e: JQuery.Event) {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    this.sendMessage();
  }

  sendMessage() {
    const content = this.$("#send-message-input").val() as string;

    if (!content) {
      return;
    }

    const message = new Message({
      content,
      room_id: this.rooms.selectedRoom.get("id"),
    });
    message.save();

    this.clearInput();
  }

  clearInput() {
    this.$("#send-message-input").val("");
  }

  render() {
    const template = $("#chat-input-template").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
