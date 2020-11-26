import Backbone from "backbone";
import Room from "../models/Room";

export default class Rooms extends Backbone.Collection<Room> {
  private _selectedRoom: Room;
  preinitialize() {
    this.model = Room;
  }

  constructor() {
    super();

    this._selectedRoom = undefined;
    this.listenToOnce(this, "add", this.initSelectedRoom);
  }

  initSelectedRoom(firstRoom: Room) {
    firstRoom.select();
  }

  public get selectedRoom(): Readonly<Room | undefined> {
    return this._selectedRoom;
  }

  setSelected(room: Room) {
    if (this.selectedRoom) {
      this.selectedRoom.toggle();
    }
    this._selectedRoom = room;
    this.selectedRoom.toggle();
  }

  url = () => "http://localhost:3000/room";
}
