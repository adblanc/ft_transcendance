import Backbone from "backbone";
import consumer from "channels/consumer";
import Messages from "src/collections/Messages";
import Message, { IMessage } from "./Message";

export interface IRoom {
  name: string;
  password?: string;
  id?: number;
  selected?: boolean;
}

export default class Room extends Backbone.Model<IRoom> {
  channel: ActionCable.Channel;
  messages: Messages;
  currentUserId?: number;

  preinitialize() {
    this.messages = new Messages();
    this.channel = undefined;
    this.currentUserId = undefined;
  }

  url = () => "http://localhost:3000/rooms";

  createConsumer() {
    const room_id = this.get("id");
    return consumer.subscriptions.create(
      { channel: "RoomChannel", room_id },
      {
        connected: () => {
          console.log("connected to", room_id);
        },
        received: (message: IMessage) => {
          console.log("we received", message);
          if (!this.currentUserId) {
            this.currentUserId = parseInt(
              $("#current-user-profile").data("id")
            );
          }
          this.messages.add(
            new Message({
              ...message,
              sent: this.currentUserId === message.user_id,
            })
          );
        },
      }
    );
  }

  asyncFetch(options?: Backbone.ModelFetchOptions): Promise<Room> {
    return new Promise((res, rej) => {
      super.fetch({
        ...options,
        success: () => res(this),
        error: (_, jqxhr) => {
          rej(this.mapServerErrors(jqxhr.responseJSON));
        },
      });
    });
  }

  asyncSave(attrs?: any, options?: Backbone.ModelSaveOptions): Promise<Room> {
    return new Promise((res, rej) => {
      super.save(attrs, {
        ...options,
        success: () => res(this),
        error: (_, jqxhr) => rej(this.mapServerErrors(jqxhr.responseJSON)),
      });
    });
  }

  mapServerErrors(errors: Record<string, string[]>) {
    return Object.keys(errors).map((key) => `${key} ${errors[key].join(",")}`);
  }

  select() {
    //@ts-ignore
    this.collection.setSelected(this);
    this.messages.reset();

    this.cleanChannel();
    this.channel = this.createConsumer();
  }

  cleanChannel() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = undefined;
    }
  }

  toggle() {
    this.set("selected", !this.get("selected"));
    this.cleanChannel();
  }
}
