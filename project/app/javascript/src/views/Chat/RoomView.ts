import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import Message from "src/models/Message";
import Room from "src/models/Room";
import MessageView from "./MessageView";
import RoomMessagesView from "./RoomMessagesView";

export default class RoomView extends BaseView<Room> {
  roomMessagesView: Backbone.View;

  constructor(options?: Backbone.ViewOptions<Room>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Room model.");
    }

    this.listenTo(this.model, "change", this.render);
    this.roomMessagesView = new RoomMessagesView({ model: this.model });
  }

  events() {
    return {
      "click .room-name": this.onClick,
    };
  }

  onClick() {
    console.log("on click room name");
    if (!this.model.get("selected")) {
      this.model.select();
    }
  }

  renderMsg(message: Message) {
    $("#messages-container").append(
      new MessageView({ model: message }).render().el
    );
  }

  render() {
    if (this.model.get("selected")) {
      this.roomMessagesView.render();
    } else {
    }

    const template = $("#roomTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}
