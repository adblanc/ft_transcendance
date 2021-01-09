import Backbone from "backbone";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import Message from "src/models/Message";
import { currentUser } from "src/models/Profile";
import Room from "src/models/Room";
import RoomUser from "src/models/RoomUser";
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

    const currentRoomUser = this.model
      .get("users")
      .find((u) => u.get("login") === currentUser().get("login"));

    const sender =
      this.model
        .get("users")
        .find((u) => u.get("id") === message.get("user_id")) ||
      new RoomUser(
        {
          login: message.get("user_login"),
          id: message.get("user_id"),
          roomRole: "Member",
          avatar_url: message.get("avatar_url"),
        },
        { collection: this.model.get("users") }
      );

    const profileView = new RoomUserProfileView({
      model: sender,
      currentRoomUser,
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
