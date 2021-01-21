import Backbone from "backbone";
import { RoomsGlobalData } from "channels/rooms_global_channel";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import PublicRoom from "src/models/PublicRoom";
import BaseRooms from "./BaseRooms";

export default class PublicRooms extends BaseRooms<PublicRoom> {
  preinitialize() {
    this.model = PublicRoom;

    this.listenTo(eventBus, "chat:my-room-left", this.myRoomLeft);
  }

  url = () => `${BASE_ROOT}/rooms`;

  myRoomLeft() {
    this.fetch();
  }
}
