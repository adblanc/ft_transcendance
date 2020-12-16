import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
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
  }

  initSelectedRoom() {
    this.selectFirst();
  }

  selectFirst() {
    this.setSelected(this.first());
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
