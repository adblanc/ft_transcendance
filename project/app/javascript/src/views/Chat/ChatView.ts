import Mustache from "mustache";
import MyRooms from "src/collections/MyRooms";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import ChatHeaderView from "./Header/ChatHeaderView";
import ChatInputView from "./ChatInputView";
import CreateJoinChannelView from "./CreateJoinChannelView";
import PublicRoomsView from "./PublicRoomsView";
import MyRoomsView from "./MyRoomsView";
import BlockedUsersView from "./BlockedUsersView";

export default class ChatView extends BaseView {
  myRooms: MyRooms;
  publicRoomsView: PublicRoomsView;
  myRoomsView: MyRoomsView;
  blockedUsersView: BlockedUsersView;
  createJoinChannelView: CreateJoinChannelView;
  chatHeaderView?: ChatHeaderView;
  chatInputView?: ChatInputView;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.myRooms = new MyRooms();
    this.myRoomsView = new MyRoomsView({
      myRooms: this.myRooms,
    });

    this.createJoinChannelView = new CreateJoinChannelView({
      rooms: this.myRooms,
    });

    this.blockedUsersView = new BlockedUsersView();

    this.publicRoomsView = new PublicRoomsView();

    this.chatHeaderView = undefined;
    this.chatInputView = undefined;

    this.listenTo(eventBus, "chat:toggle", this.toggleChat);
    this.listenTo(eventBus, "chat:close", this.closeChat);
    this.listenTo(this.myRooms, "add", this.refreshHeaderInput);
    this.listenTo(this.myRooms, "remove", this.removeHeaderInput);
  }

  onClose = () => {
    this.myRoomsView.close();
    this.createJoinChannelView.close();
    this.publicRoomsView.close();
    this.chatHeaderView?.close();
    this.chatInputView?.close();
  };

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

  closeChat() {
    if (!this.$el.hasClass("invisible")) {
      this.$el.addClass("invisible");
    }
  }

  refreshHeaderInput() {
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
  }

  removeHeaderInput() {
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

    this.preprendNested(this.blockedUsersView, "#left-container-chat");

    this.preprendNested(this.createJoinChannelView, "#left-container-chat");

    this.appendNested(this.myRoomsView, "#left-container-chat");
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
