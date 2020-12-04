import Backbone from "backbone";
import Message from "src/models/Message";
import Room from "src/models/Room";
import MessageView from "./MessageView";

export default class RoomMessagesView extends Backbone.View<Room> {
  constructor(options?: Backbone.ViewOptions<Room>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Room model.");
    }

    this.listenTo(this.model.messages, "add", this.renderMsg);
  }

  renderMsg(message: Message) {
    this.$el.append(new MessageView({ model: message }).render().el);

    if (this.model.get("selected")) {
      this.render();
    }
  }

  render() {
    $("#messages-container").html(this.$el.html());

    return this;
  }
}
