import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import AdminRoom from "src/models/AdminRoom";
import BaseRooms from "./BaseRooms";

export default class AdminRooms extends BaseRooms<AdminRoom> {
	preinitialize() {
		this.model = AdminRoom;
	}

	constructor() {
		super();

		this.selectedRoom = undefined;
		this.listenTo(eventBus, "chat:rooms_global:created", this.fetch);
		this.listenTo(eventBus, "chat:rooms_global:admin_created", this.fetch);
	}

	setSelected(room: AdminRoom) {
		if (this.selectedRoom &&
				this.find((r) => r.get("id") === this.selectedRoom.get("id"))) {
			this.selectedRoom.toggle();
		}
		this.selectedRoom = room;
		this.selectedRoom.toggle();
	}

	url = () => `${BASE_ROOT}/admin-rooms`;
}
