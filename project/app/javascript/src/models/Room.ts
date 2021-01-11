import Backbone from "backbone";
import consumer from "channels/consumer";
import Messages from "src/collections/Messages";
import RoomUsers from "src/collections/RoomUsers";
import { BASE_ROOT } from "src/constants";
import { eventBus } from "src/events/EventBus";
import BaseRoom from "./BaseRoom";
import Message, { IMessage } from "./Message";
import { currentUser } from "./Profile";
import RoomUser from "./RoomUser";

export default class Room extends BaseRoom {
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
        connected: () => {
          console.log("connected to", room_id);
        },
        received: (message: IMessage) => {
          const blocked = currentUser()
            .get("blocked_users")
            .find((u) => u.id === message.user_id);

          if (
            !message.ancient &&
            message.content.includes(
              `${currentUser().get("login")} has been banned`
            )
          ) {
            return this.quit();
          }

          if (!blocked) {
            this.messages.add(
              new Message({
                ...message,
                sent: currentUser().get("id") === message.user_id,
              })
            );
          }
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

  async quit() {
    const success = await this.asyncDestroy({
      url: `${BASE_ROOT}/quit-room?name=${this.get("name")}`,
    });

    if (success) {
      this.channel.unsubscribe();
    }
    return success;
  }

  modifyPassword(password: string) {
    return this.asyncSave({
      password,
    });
  }
}
