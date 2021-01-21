import { eventBus } from "src/events/EventBus";
import consumer from "./consumer";

export interface RoomsGlobalData {
  action: "channel_deleted";

  payload: {
    id: number;
  };
}

consumer.subscriptions.create(
  { channel: "RoomsGlobalChannel" },
  {
    connected() {
      console.log("connected to rooms global channel");
    },
    received(data: RoomsGlobalData) {
      console.log("received rooms global", data);
      eventBus.trigger("chat:rooms_global:deleted", data);
    },
    disconnected() {
      console.log("disconnected from rooms global channel");
    },
  }
);
