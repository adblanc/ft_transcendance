import Backbone from "backbone";
import { RoomsGlobalData } from "channels/rooms_global_channel";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import AdminRoom from "src/models/AdminRoom";
import BaseRooms from "./BaseRooms";

export default class AdminRooms extends BaseRooms<AdminRoom> {
  preinitialize() {
    this.model = AdminRoom;

    this.listenTo(eventBus, "chat:rooms_global:created", this.fetch);
    this.listenTo(eventBus, "chat:rooms_global:admin_created", this.fetch);
  }

  url = () => `${BASE_ROOT}/admin-rooms`;
}
