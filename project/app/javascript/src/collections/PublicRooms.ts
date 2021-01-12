import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import PublicRoom from "src/models/PublicRoom";

export default class PublicRooms extends Backbone.Collection<PublicRoom> {
  preinitialize() {
    this.model = PublicRoom;

    this.listenTo(this, "remove", this.onRemove);
    this.listenTo(eventBus, "chat:my-room-left", this.myRoomLeft);
  }

  url = () => `${BASE_ROOT}/rooms`;

  onRemove(room: PublicRoom) {
    eventBus.trigger("chat:public-channel-joined", room);
  }

  myRoomLeft() {
    this.fetch();
  }
}
