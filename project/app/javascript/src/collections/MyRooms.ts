import Backbone from "backbone";
import { RoomsGlobalData } from "channels/rooms_global_channel";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import PublicRoom from "src/models/PublicRoom";
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
    this.listenTo(eventBus, "chat:public-channel-joined", this.addPublicRoom);
    this.listenTo(eventBus, "chat:other-user-dm-creation", () => this.fetch());
  }

  addPublicRoom(publicRoom: PublicRoom) {
    const room = new Room(publicRoom.toJSON());
    this.selectedRoom?.toggle();
    this.selectedRoom = undefined;
    this.add(room);
  }

  checkSelectedAdd(room: Room) {
    if (!this.selectedRoom) {
      this.setSelected(room);
    }
  }

  onRemove(room: Room) {
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
      console.log("toggle previosu selectedRoom");
      this.selectedRoom.toggle();
    }
    this.selectedRoom = room;
    this.selectedRoom.toggle();
	console.log("set and toggle selectedRoom", room);
	eventBus.trigger("chatplay:toggle");
  }

  url = () => `${BASE_ROOT}/my-rooms`;
}
