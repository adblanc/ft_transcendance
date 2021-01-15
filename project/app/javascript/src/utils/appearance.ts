import consumer from "channels/consumer";
import { eventBus } from "src/events/EventBus";

export type AppearanceData = {
  event: "disappear" | "appear";
  user_id: number;
  appearing_on: string;
};

export const createAppereanceConsumer = () => {
  return consumer.subscriptions.create("AppearanceChannel", {
    connected() {
      console.log("Connected to appearance");
    },

    disconnected() {
      // Called when the subscription has been terminated by the server

      console.log("Disconnected from appearance");
    },

    received(data: AppearanceData) {
      console.log("received: ", data);
      eventBus.trigger("appeareance", data);
      // Called when there's incoming data on the websocket for this channel
    },
  });
};
