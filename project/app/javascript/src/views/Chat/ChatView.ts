import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import Room from "src/models/Room";
import ChatHeaderView from "./Header/ChatHeaderView";
import ChatInputView from "./ChatInputView";
import CreateJoinChannelView from "./CreateJoinChannelView";
import RoomView from "./RoomView";

export default class ChatView extends BaseView {
  rooms: Rooms;
  createJoinChannelView: CreateJoinChannelView;
  chatHeaderView?: ChatHeaderView;
  chatInputView?: ChatInputView;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.rooms = new Rooms();

    this.rooms.fetch();

    this.createJoinChannelView = new CreateJoinChannelView({
      rooms: this.rooms,
    });

    this.chatHeaderView = undefined;
    this.chatInputView = undefined;

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

  renderRoom(room: Room) {
    console.log("we render", room.get("id"));
    if (!this.chatHeaderView) {
      this.chatHeaderView = new ChatHeaderView({
        rooms: this.rooms,
      });
      this.renderChatHeader();
    }
    if (!this.chatInputView) {
      this.chatInputView = new ChatInputView({
        rooms: this.rooms,
      });
      this.renderChatInput();
    }

    this.$("#room-list").append(new RoomView({ model: room }).render().el);
  }

  removeRoom(room: Room) {
    this.$(`#room-${room.get("id")}`)
      .parent()
      .remove();

    if (!this.roomsLength()) {
      if (this.chatHeaderView) {
        this.chatHeaderView.close();
        this.chatHeaderView = undefined;
      }
      if (this.chatInputView) {
        this.chatInputView.close();
        this.chatInputView = undefined;
      }

      this.$("#messages-container").empty();
    }
  }

  roomsLength = () => this.$("#room-list").children().length;

  render() {
    const template = $("#chat-container-template").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.preprendNested(this.createJoinChannelView, "#left-container-chat");

    return this;
  }

  renderChatHeader() {
    this.preprendNested(this.chatHeaderView, "#right-container-chat");
  }

  renderChatInput() {
    this.appendNested(this.chatInputView, "#right-container-chat");
  }
}
