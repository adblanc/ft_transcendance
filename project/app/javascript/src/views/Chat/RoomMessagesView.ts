import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import Message from "src/models/Message";
import Room from "src/models/Room";
import MessageView from "./MessageView";

export default class RoomMessagesView extends BaseView<Room> {
  constructor(options?: Backbone.ViewOptions<Room>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Room model.");
    }

    this.listenTo(this.model.messages, "add", this.renderMsg);
  }

  renderMsg(message: Message) {
    console.log("we render msg");
    $("#messages-container").append(
      new MessageView({ model: message }).render().el
    );
  }

  render() {
    $("#messages-container").children().remove();
    this.model.messages.forEach((msg) => this.renderMsg(msg));

    return this;
  }
}
