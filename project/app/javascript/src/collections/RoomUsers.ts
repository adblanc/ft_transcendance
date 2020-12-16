import Backbone from "backbone";
import RoomUser from "src/models/RoomUser";

export default class RoomUsers extends Backbone.Collection<RoomUser> {
  initialize() {
    this.model = RoomUser;
  }
}
