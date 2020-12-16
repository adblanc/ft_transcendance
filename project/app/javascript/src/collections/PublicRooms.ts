import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import PublicRoom from "src/models/PublicRoom";
import Room from "../models/Room";

export default class PublicRooms extends Backbone.Collection<PublicRoom> {
  selectedRoom?: Room;
  preinitialize() {
    this.model = PublicRoom;
  }

  url = () => `${BASE_ROOT}/rooms`;
}
