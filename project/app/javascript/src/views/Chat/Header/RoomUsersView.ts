import RoomUsers from "src/collections/RoomUsers";
import BaseView from "src/lib/BaseView";
import RoomUser from "src/models/RoomUser";
import RoomUserView from "./RoomUserView";

type Options = Backbone.ViewOptions & {
  roomUsers: RoomUsers;
  isCurrentUserOwner: boolean;
};

export default class RoomUsersView extends BaseView {
  roomUsers: RoomUsers;
  isCurrentUserOwner: boolean;

  constructor(options: Options) {
    super(options);

    this.roomUsers = options.roomUsers;

    if (!this.roomUsers) {
      throw Error("Please provide room users to this view.");
    }

    this.isCurrentUserOwner = options.isCurrentUserOwner;
  }

  renderRoomUser(roomUser: RoomUser) {
    this.$el.append(
      new RoomUserView({
        model: roomUser,
        isCurrentUserOwner: this.isCurrentUserOwner,
      }).render().el
    );
  }

  render() {
    this.roomUsers.forEach((user) => this.renderRoomUser(user));

    return this;
  }
}
