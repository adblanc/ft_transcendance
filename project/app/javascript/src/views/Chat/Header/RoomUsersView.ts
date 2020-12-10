import RoomUsers from "src/collections/RoomUsers";
import BaseView from "src/lib/BaseView";
import RoomUser from "src/models/RoomUser";
import RoomUserView from "./RoomUserView";

type Options = Backbone.ViewOptions & {
  roomUsers: RoomUsers;
};

export default class RoomUsersView extends BaseView {
  roomUsers: RoomUsers;

  constructor(options: Options) {
    super(options);

    this.roomUsers = options.roomUsers;

    if (!this.roomUsers) {
      throw "Please provide room users to this view.";
    }
  }

  renderRoomUser(roomUser: RoomUser) {
    this.$el.append(new RoomUserView({ model: roomUser }).render().el);
  }

  render() {
    this.roomUsers.forEach((user) => this.renderRoomUser(user));

    return this;
  }
}
