import Mustache from "mustache";
import MyRooms from "src/collections/MyRooms";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import Room from "src/models/Room";
import ChatHeaderView from "./Header/ChatHeaderView";
import ChatInputView from "./ChatInputView";
import CreateJoinChannelView from "./CreateJoinChannelView";
import RoomView from "./RoomView";
import PublicRoomsView from "./PublicRoomsView";

export default class ChatView extends BaseView {
  myRooms: MyRooms;
  publicRoomsView: PublicRoomsView;
  createJoinChannelView: CreateJoinChannelView;
  chatHeaderView?: ChatHeaderView;
  chatInputView?: ChatInputView;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.myRooms = new MyRooms();
    this.myRooms.fetch();

    this.createJoinChannelView = new CreateJoinChannelView({
      rooms: this.myRooms,
    });

    this.publicRoomsView = new PublicRoomsView();

    this.chatHeaderView = undefined;
    this.chatInputView = undefined;

    this.listenTo(eventBus, "chat:open", this.toggleChat);
    this.listenTo(this.myRooms, "add", this.renderMyRoom);
    this.listenTo(this.myRooms, "remove", this.removeMyRoom);
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

  renderMyRoom(room: Room) {
    console.log("we render", room.get("id"));
    if (!this.chatHeaderView) {
      this.chatHeaderView = new ChatHeaderView({
        rooms: this.myRooms,
      });
      this.renderChatHeader();
    }
    if (!this.chatInputView) {
      this.chatInputView = new ChatInputView({
        rooms: this.myRooms,
      });
      this.renderChatInput();
    }

    this.$("#my-rooms-list").append(new RoomView({ model: room }).render().el);
  }

  removeMyRoom(room: Room) {
    this.$(`#room-${room.get("id")}`)
      .parent()
      .remove();

    if (!this.myRoomsLength()) {
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

  myRoomsLength = () => this.$("#my-rooms-list").children().length;

  render() {
    const template = $("#chat-container-template").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.preprendNested(this.createJoinChannelView, "#left-container-chat");

    this.appendNested(this.publicRoomsView, "#left-container-chat");

    return this;
  }

  renderChatHeader() {
    this.preprendNested(this.chatHeaderView, "#right-container-chat");
  }

  renderChatInput() {
    this.appendNested(this.chatInputView, "#right-container-chat");
  }
}
