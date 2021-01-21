import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import PublicRoom from "src/models/PublicRoom";

export default class PublicRooms extends Backbone.Collection<PublicRoom> {
  preinitialize() {
    this.model = PublicRoom;

    this.listenTo(eventBus, "chat:my-room-left", this.myRoomLeft);
    this.listenTo(
      eventBus,
      "chat:rooms_global:deleted",
      this.onGlobalRoomDelete
    );
  }

  url = () => `${BASE_ROOT}/rooms`;

  onGlobalRoomDelete(data: any) {
    const room = this.find((r) => r.get("id") === data.payload.id);

    if (room) {
      this.remove(room);
    }
  }

  myRoomLeft() {
    this.fetch();
  }
}
