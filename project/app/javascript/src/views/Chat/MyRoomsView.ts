import Backbone from "backbone";
import Mustache from "mustache";
import MyRooms from "src/collections/MyRooms";
import BaseView from "src/lib/BaseView";
import PublicRoom from "src/models/PublicRoom";
import Room from "src/models/Room";
import MyRoomView from "./MyRoomView";

type Options = Backbone.ViewOptions & {
  myRooms: MyRooms;
};

const MY_ROOMS_VIEW_INFOS = {
  label: "My channels list",
  id: "my-rooms-list",
};

export default class MyRoomsView extends BaseView {
  myRooms: MyRooms;

  constructor(options?: Options) {
    super(options);

    this.myRooms = options.myRooms;
    this.myRooms.fetch();

    this.listenTo(this.myRooms, "add", this.renderMyRoom);
    this.listenTo(this.myRooms, "remove", this.removeMyRoom);
  }

  renderMyRoom(room: Room) {
    this.$("#my-rooms-list").append(
      new MyRoomView({ model: room }).render().el
    );
  }

  removeMyRoom(room: PublicRoom) {
    this.$(`#room-${room.get("id")}`)
      .parent()
      .remove();
  }

  render() {
    const template = $("#rooms-list-template").html();
    const html = Mustache.render(template, MY_ROOMS_VIEW_INFOS);
    this.$el.html(html);

    return this;
  }
}
