import Backbone from "backbone";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import Message from "src/models/Message";
import Room from "src/models/Room";
import { displayError } from "src/utils";
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

  showProfileModal(userId: number) {
    const user = this.model
      .get("users")
      .find((user) => user.get("id") === userId);

    if (!user) {
      displayError("This user is no longer in the room.");
    }

    const currentUser = this.model
      .get("users")
      .find((u) => u.get("login") === $("#current-user-profile").data("login"));

    console.log("current user", currentUser);

    const profileView = new RoomUserProfileView({
      model: user,
      currentUser,
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
