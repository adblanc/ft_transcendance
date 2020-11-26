import Backbone from "backbone";
import consumer from "channels/consumer";
import Messages from "src/collections/Messages";
import Message, { IMessage } from "./Message";

export interface IRoom {
  name: string;
  id?: number;
  selected?: boolean;
}

export default class Room extends Backbone.Model<IRoom> {
  channel: ActionCable.Channel;
  messages: Messages;

  preinitialize() {
    this.messages = new Messages();
    this.channel = undefined;
  }

  url = () => "http://localhost:3000/room";

  createConsumer() {
    const room_id = this.get("id");
    return consumer.subscriptions.create(
      { channel: "RoomChannel", room_id },
      {
        connected: () => {
          console.log("connected to", room_id);
        },
        received: (message: IMessage) => {
          this.messages.add(new Message(message));
        },
      }
    );
  }

  cleanChannel() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = undefined;
    }
  }

  select() {
    //@ts-ignore
    this.collection.setSelected(this);

    this.cleanChannel();
    this.channel = this.createConsumer();
  }

  toggle() {
    this.set("selected", !this.get("selected"));
    this.cleanChannel();
  }
}
