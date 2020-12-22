import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import PublicRoom from "src/models/PublicRoom";
import Room from "../models/Room";

export default class PublicRooms extends Backbone.Collection<PublicRoom> {
  preinitialize() {
    this.model = PublicRoom;

    this.listenTo(this, "remove", this.onRemove);
    this.listenTo(eventBus, "chat:my-room-left", this.checkMyRoomLeft);
  }

  url = () => `${BASE_ROOT}/rooms`;

  onRemove(room: PublicRoom) {
    eventBus.trigger("chat:public-channel-joined", room);
  }

  checkMyRoomLeft(room: Room) {
    if (!room.get("is_private")) {
      this.add(new PublicRoom({ ...room.toJSON(), selected: false }));
    }
  }
}
