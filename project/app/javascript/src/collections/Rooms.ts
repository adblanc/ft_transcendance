import Backbone from "backbone";
import Room from "../models/Room";

export default class Rooms extends Backbone.Collection<Room> {
  selectedRoom?: Room;
  preinitialize() {
    this.model = Room;
  }

  constructor() {
    super();

    this.selectedRoom = undefined;
    this.listenToOnce(this, "add", this.initSelectedRoom);
  }

  initSelectedRoom(firstRoom: Room) {
    firstRoom.select();
  }

  setSelected(room: Room) {
    if (this.selectedRoom) {
      this.selectedRoom.toggle();
    }
    this.selectedRoom = room;
    console.log("on set selected a ", room);
    this.selectedRoom.toggle();
  }

  url = () => "http://localhost:3000/rooms";
}
