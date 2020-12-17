import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import { IRoom } from "src/models/BaseRoom";
import PublicRoom from "src/models/PublicRoom";
import Room from "../models/Room";

export default class MyRooms extends Backbone.Collection<Room> {
  selectedRoom?: Room;
  preinitialize() {
    this.model = Room;
  }

  constructor() {
    super();

    this.selectedRoom = undefined;
    this.listenTo(this, "add", this.checkSelectedAdd);
    this.listenTo(this, "remove", this.checkSelectedRemove);
    this.listenTo(eventBus, "chat:public-channel-joined", this.addPublicRoom);
  }

  addPublicRoom(room: PublicRoom) {
    this.add(new Room(room.toJSON()));
  }

  checkSelectedAdd(room: Room) {
    if (!this.selectedRoom) {
      this.setSelected(room);
    }
  }

  checkSelectedRemove(room: Room) {
    if (room === this.selectedRoom) {
      if (this.size()) {
        this.setSelected(this.first());
      } else {
        this.selectedRoom = undefined;
      }
    }
  }

  setSelected(room: Room) {
    if (
      this.selectedRoom &&
      this.find((r) => r.get("id") === this.selectedRoom.get("id"))
    ) {
      this.selectedRoom.toggle();
    }
    this.selectedRoom = room;
    this.selectedRoom.toggle();
  }

  url = () => `${BASE_ROOT}/my-rooms`;
}
