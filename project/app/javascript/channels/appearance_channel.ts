import consumer from "./consumer";

type Data = {
  event: "disappear" | "appear";
  user_id: number;
};

export const appearanceChannel = consumer.subscriptions.create(
  "AppearanceChannel",
  {
    connected() {
      console.log("Connected to appearance");
    },

    disconnected() {
      // Called when the subscription has been terminated by the server

      console.log("Disconnected from appearance");
    },

    received(data: Data) {
      console.log("received: ", data);
      // Called when there's incoming data on the websocket for this channel
    },
  }
);
