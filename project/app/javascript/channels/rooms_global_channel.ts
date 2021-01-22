import { eventBus } from "src/events/EventBus";
import consumer from "./consumer";

export interface RoomsGlobalData {
  action: "channel_deleted" | "channel_created";

  payload?: {
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
      if (data.action === "channel_deleted") {
        eventBus.trigger("chat:rooms_global:deleted", data);
      } else if (data.action === "channel_created") {
        eventBus.trigger("chat:rooms_global:created");
      }
    },
    disconnected() {
      console.log("disconnected from rooms global channel");
    },
  }
);
