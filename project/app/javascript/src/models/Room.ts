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

  initialize() {
    this.messages = new Messages();
    this.channel = this.createConsumer();
    this.currentUserId = undefined;

    this.listenTo(this, "change:id", this.updateChannel);
  }

  url = () => "http://localhost:3000/rooms";

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

  updateChannel() {
    console.log("we change channel");
    if (this.channel) {
      this.channel.unsubscribe();
    }

    this.channel = this.createConsumer();
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
  }

  toggle() {
    this.set("selected", !this.get("selected"));
  }
}
