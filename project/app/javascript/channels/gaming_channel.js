import consumer from "./consumer"

consumer.subscriptions.create("GamingChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected to gaming channel...");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
  }
});
