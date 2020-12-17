import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import PublicRoom from "src/models/PublicRoom";
import Room from "../models/Room";

export default class PublicRooms extends Backbone.Collection<PublicRoom> {
  selectedRoom?: Room;
  preinitialize() {
    this.model = PublicRoom;

    this.listenTo(this, "remove", this.onRemove);
  }

  url = () => `${BASE_ROOT}/rooms`;

  onRemove(room: PublicRoom) {
    console.log("we remove", room);
    eventBus.trigger("chat:public-channel-joined", room);
  }
}
