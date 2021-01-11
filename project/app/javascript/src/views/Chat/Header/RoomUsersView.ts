import RoomUsers from "src/collections/RoomUsers";
import BaseView from "src/lib/BaseView";
import { currentUser } from "src/models/Profile";
import RoomUser from "src/models/RoomUser";
import RoomUserView from "./RoomUserView";

type Options = Backbone.ViewOptions & {
  roomUsers: RoomUsers;
};

export default class RoomUsersView extends BaseView {
  roomUsers: RoomUsers;
  currentRoomUser: RoomUser;

  constructor(options: Options) {
    super(options);

    this.roomUsers = options.roomUsers;

    if (!this.roomUsers) {
      throw Error("Please provide room users to this view.");
    }

    this.currentRoomUser = this.roomUsers.find(
      (u) => u.get("login") === currentUser().get("login")
    );
  }

  renderRoomUser(roomUser: RoomUser) {
    this.$el.append(
      new RoomUserView({
        model: roomUser,
        currentRoomUser: this.currentRoomUser,
      }).render().el
    );
  }

  render() {
    this.roomUsers.forEach((user) => this.renderRoomUser(user));

    return this;
  }
}
