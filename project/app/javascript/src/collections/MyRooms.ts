import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import Room from "../models/Room";
import BaseRooms from "./BaseRooms";

export default class MyRooms extends BaseRooms<Room> {
  selectedRoom?: Room;
  preinitialize() {
    this.model = Room;
  }

  constructor() {
    super();

    this.selectedRoom = undefined;
    this.listenTo(this, "add", this.checkSelectedAdd);
    this.listenTo(this, "remove", this.onRemove);
    this.listenTo(eventBus, "chat:channel-joined", this.addRoom);
    this.listenTo(eventBus, "chat:other-user-dm-creation", () => this.fetch());
  }

  addRoom(room: Room) {
    const roomInAdminList = this.find(
      (r) => r.get("isInAdminList") && r.get("id") === room.get("id")
    );

    if (roomInAdminList) {
      roomInAdminList.unsubscribe();
      this.remove(roomInAdminList);
    }

    const myRoom = new Room({ ...room.toJSON(), isInAdminList: false });

    this.selectedRoom?.toggle();

    this.selectedRoom = undefined;
    this.add(myRoom);
  }

  checkSelectedAdd(room: Room) {
    if (!this.selectedRoom) {
      this.setSelected(room);
    }
  }

  onRemove(room: Room) {
    room.unsubscribe();
    this.checkSelectedRemove(room);
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
    eventBus.trigger("chatplay:toggle");
  }

  url = () => `${BASE_ROOT}/my-rooms`;
}
