import Backbone from "backbone";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import Message from "src/models/Message";
import Room from "src/models/Room";
import MessageView from "./MessageView";
import RoomUserProfileView from "./RoomUserProfileView";

export default class RoomMessagesView extends BaseView<Room> {
  constructor(options?: Backbone.ViewOptions<Room>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Room model.");
    }

    this.listenTo(this.model.messages, "add", this.renderMsg);

    this.listenTo(eventBus, "chat:profile-clicked", this.showProfileModal);
  }

  showProfileModal(message: Message) {
    if (message.get("room_id") !== this.model.get("id")) {
      return;
    }

    const currentUser = this.model
      .get("users")
      .find((u) => u.get("login") === $("#current-user-profile").data("login"));

    const sender = this.model
      .get("users")
      .find((u) => u.get("id") === message.get("user_id"));

    const profileView = new RoomUserProfileView({
      model: message,
      sender,
      isRoomAdministrator: currentUser.get("isRoomAdministrator"),
    });

    profileView.render();
  }

  renderMsg(message: Message) {
    $("#messages-container").append(
      new MessageView({ model: message }).render().el
    );
  }

  render() {
    $("#messages-container").children().remove();
    this.model.messages.forEach((msg) => this.renderMsg(msg));

    return this;
  }
}
