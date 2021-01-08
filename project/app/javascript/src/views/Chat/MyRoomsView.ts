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
  myRoomViews: MyRoomView[];

  constructor(options?: Options) {
    super(options);

    this.myRoomViews = [];
    this.myRooms = options.myRooms;
    this.myRooms.fetch();

    this.listenTo(this.myRooms, "add", this.renderMyRoom);
    this.listenTo(this.myRooms, "remove", this.removeMyRoom);
  }

  onClose = () => {
    this.myRooms.forEach((room) => this.removeMyRoom(room));
  };

  renderMyRoom(room: Room) {
    const myRoomView = new MyRoomView({ model: room });
    this.myRoomViews.push(myRoomView);
    this.$("#my-rooms-list").append(myRoomView.render().el);
  }

  removeMyRoom(room: PublicRoom) {
    this.myRoomViews.forEach((room) => room.close());
  }

  render() {
    const template = $("#rooms-list-template").html();
    const html = Mustache.render(template, MY_ROOMS_VIEW_INFOS);
    this.$el.html(html);

    return this;
  }
}
