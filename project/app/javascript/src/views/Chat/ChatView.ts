import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import PageView from "src/lib/PageView";
import Room from "src/models/Room";
import CreateJoinChannelView from "./CreateJoinChannelView";
import RoomView from "./RoomView";

export default class ChatView extends PageView {
  rooms: Rooms;
  createJoinChannelView: CreateJoinChannelView;

  constructor(options?: any) {
    super(options);

    this.rooms = new Rooms();

    this.rooms.fetch();

    this.createJoinChannelView = new CreateJoinChannelView({
      rooms: this.rooms,
    });

    this.listenTo(this.rooms, "add", this.renderRoom);
    this.listenTo(this.rooms, "remove", this.removeRoom);
  }

  renderRoom(room: Room) {
    this.$("#room-list").append(new RoomView({ model: room }).render().el);
  }

  removeRoom(room: Room) {
    this.$(`#room-${room.get("id")}`).remove();
  }

  render() {
    const template = $("#chat-container-template").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.preprendNested(this.createJoinChannelView, "#left-container-chat");

    return this;
  }
}
