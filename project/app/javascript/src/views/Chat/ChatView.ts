import Mustache from "mustache";
import MyRooms from "src/collections/MyRooms";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import ChatHeaderView from "./Header/ChatHeaderView";
import ChatInputView from "./ChatInputView";
import CreateJoinChannelView from "./CreateJoinChannelView";
import PublicRoomsView from "./PublicRoomsView";
import AdminRoomsView from "./AdminRoomsView";
import MyRoomsView from "./MyRoomsView";
import DirectMessagesView from "./DirectMessagesView";
import Room from "src/models/Room";

export default class ChatView extends BaseView {
  myRooms: MyRooms;
  publicRoomsView: PublicRoomsView;
  adminRoomsView: AdminRoomsView;
  myRoomsView: MyRoomsView;
  directMessagesView: DirectMessagesView;
  createJoinChannelView: CreateJoinChannelView;
  chatHeaderView?: ChatHeaderView;
  chatInputView?: ChatInputView;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.myRooms = new MyRooms();
    this.myRooms.fetch();

    this.myRoomsView = new MyRoomsView({
      myRooms: this.myRooms,
    });

    this.directMessagesView = new DirectMessagesView({
      myRooms: this.myRooms,
    });

    this.createJoinChannelView = new CreateJoinChannelView({
      rooms: this.myRooms,
    });

    this.publicRoomsView = new PublicRoomsView();
	this.adminRoomsView = new AdminRoomsView();

    this.chatHeaderView = undefined;
    this.chatInputView = undefined;

    this.listenTo(eventBus, "chat:toggle", this.toggleChat);
    this.listenTo(eventBus, "chat:close", this.hideChat);
    this.listenTo(eventBus, "chat:open", this.showChat);
    this.listenTo(eventBus, "chat:go-to-dm", this.goToDm);
    this.listenTo(this.myRooms, "add", this.refreshHeaderInput);
    this.listenTo(this.myRooms, "remove", this.removeHeaderInput);
  }

  onClose = () => {
    this.myRoomsView.close();
    this.createJoinChannelView.close();
    this.publicRoomsView.close();
	this.adminRoomsView.close();
    this.chatHeaderView?.close();
    this.chatInputView?.close();
  };

  private isVisible() {
    return !this.$el.hasClass("invisible");
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

  toggleChat() {
    this.$el.toggleClass("invisible");
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

  async goToDm(userId: number) {
    const dmRoom = this.myRooms.find(
      (r) =>
        r.get("is_dm") && !!r.get("users").find((u) => u.get("id") === userId)
    );

    if (dmRoom) {
      if (!dmRoom.get("selected")) {
        dmRoom.select();
      }
    } else {
      const dmRoom = new Room();
      const success = await dmRoom.createDm(userId);

      if (success) {
        this.myRooms.add(dmRoom);
        dmRoom.select();
      }
    }
  }

  render() {
    const template = $("#chat-container-template").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.preprendNested(this.createJoinChannelView, "#left-container-chat");

    this.appendNested(this.directMessagesView, "#left-container-chat");
    this.appendNested(this.myRoomsView, "#left-container-chat");
    this.appendNested(this.publicRoomsView, "#left-container-chat");
	this.appendNested(this.adminRoomsView, "#left-container-chat");

    return this;
  }

  renderChatHeader() {
    this.preprendNested(this.chatHeaderView, "#right-container-chat");
  }

  renderChatInput() {
    this.appendNested(this.chatInputView, "#right-container-chat");
  }
}
