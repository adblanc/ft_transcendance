import Backbone from "backbone";
import Mustache from "mustache";
import Message from "src/models/Message";
import Room from "src/models/Room";
import MessageView from "./MessageView";

export default class RoomView extends Backbone.View<Room> {
  channel: ActionCable.Channel;
  constructor(options?: Backbone.ViewOptions<Room>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Room model.");
    }

    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model.messages, "add", this.renderMsg);
    this.listenTo(this.model.messages, "reset", this.resetMsg);
  }

  events() {
    return {
      "click .room-name": this.onClick,
    };
  }

  onClick() {
    if (!this.model.get("selected")) {
      this.model.select();
    }
  }

  renderMsg(message: Message) {
    console.log("on render ", message.get("content"));
    $("#messages-container").append(
      new MessageView({ model: message }).render().el
    );
  }

  resetMsg() {
    $("#messages-container").html("");
  }

  render() {
    const template = $("#roomTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}
