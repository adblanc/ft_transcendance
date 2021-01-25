import consumer from "channels/consumer";
import Backbone from "backbone";
import Messages from "src/collections/Messages";
import RoomUsers from "src/collections/RoomUsers";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import Message, { IMessage } from "./Message";
import { currentUser } from "./Profile";
import BaseRoom from "./BaseRoom";
import RoomUser from "./RoomUser";

export default class AdminRoom extends BaseRoom {
	channel: ActionCable.Channel;
	messages: Messages;

	preinitialize() {
		this.relations = [
			{
				type: Backbone.Many,
				key: "users",
				collectionType: RoomUsers,
				relatedModel: RoomUser,
			},
		];
	}

	initialize() {
		this.messages = new Messages();
		this.channel = this.createConsumer();

		this.listenTo(this, "change:id", this.updateChannel);
		this.listenTo(eventBus, "global:logout", this.onLogout);
	}

	urlRoot = () => `${BASE_ROOT}/rooms`;

	onLogout() {
		this.channel?.unsubscribe();
	}

	createConsumer() {
		const room_id = this.get("id");

		if (room_id === undefined) {
			return undefined;
		}

		return consumer.subscriptions.create(
			{ channel: "RoomChannel", room_id },
			{
				connected: () => { console.log("connected to", room_id); },
				received: (message: IMessage) => {
					if (!message.ancient && !this.get("users").find((u) =>
						u.get("id") === message.user_id)) {
						this.fetch();
					}

					this.messages.add(new Message({
						...message,
						sent: currentUser().get("id") === message.user_id,
					}));
				},
			}
		);
	}

	updateChannel() {
		if (this.channel) {
			this.channel.unsubscribe();
		}

		this.channel = this.createConsumer();
	}

	select() {
		//@ts-ignore
		this.collection.setSelected(this);
	}

	toggle() {
		this.set("selected", !this.get("selected"));
	}

	async delete() {
		return await this.asyncDestroy();
	}
}
