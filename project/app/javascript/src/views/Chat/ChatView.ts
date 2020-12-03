import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import Message from "src/models/Message";
import Room from "src/models/Room";
import ChatHeaderView from "./ChatHeaderView";
import CreateJoinChannelView from "./CreateJoinChannelView";
import RoomView from "./RoomView";

export default class ChatView extends BaseView {
  rooms: Rooms;
  createJoinChannelView: CreateJoinChannelView;
  chatHeaderView: ChatHeaderView;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.rooms = new Rooms();

    this.rooms.fetch();

    this.createJoinChannelView = new CreateJoinChannelView({
      rooms: this.rooms,
    });

    this.chatHeaderView = new ChatHeaderView({
      rooms: this.rooms,
    });

    this.listenTo(eventBus, "chat:open", this.toggleChat);
    this.listenTo(this.rooms, "add", this.renderRoom);
    this.listenTo(this.rooms, "remove", this.removeRoom);
  }

  hideChat() {
    if (!this.isVisible()) {
      return;
    }
    this.toggleChat();
  }

  showChat() {
    if (this.isVisible()) {
      return;
    }
    this.toggleChat();
  }

  private isVisible() {
    return !this.$el.hasClass("invisible");
  }

  toggleChat() {
    this.$el.toggleClass("invisible");
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

  renderRoom(room: Room) {
    this.$("#room-list").append(new RoomView({ model: room }).render().el);
  }

  removeRoom(room: Room) {
    this.$(`#room-${room.get("id")}`).remove();
  }

  render() {
    const template = $("#chat-container-template").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.preprendNested(this.chatHeaderView, "#right-container-chat");

    this.preprendNested(this.createJoinChannelView, "#left-container-chat");

    return this;
  }
}
