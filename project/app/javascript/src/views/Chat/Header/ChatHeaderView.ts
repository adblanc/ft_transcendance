import Backbone from "backbone";
import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import BaseView from "src/lib/BaseView";
import { displaySuccess } from "src/utils";
import _ from "underscore";
import ManageRoomView from "./ManageRoomView";

type Options = Backbone.ViewOptions & {
  rooms: Rooms;
};

export default class ChatHeaderView extends BaseView {
  rooms: Rooms;

  constructor(options?: Options) {
    super(options);

    if (!options.rooms) {
      throw Error("Please provide a room collection to this view.");
    }

    this.rooms = options.rooms;

    this.listenTo(this.rooms, "change", this.render);
  }

  events() {
    return {
      "click #manage-room": this.manageRoom,
      "click #quit-room": this.quitRoom,
    };
  }

  async quitRoom() {
    const selectedRoom = this.rooms.selectedRoom;

    const success = await selectedRoom.quit();

    if (success) {
      displaySuccess(`Room ${selectedRoom.get("name")} successfully left`);
    }
  }

  async manageRoom() {
    new ManageRoomView({ model: this.rooms.selectedRoom }).render();
  }

  render() {
    const template = $("#chat-header-template").html();
    const html = Mustache.render(template, this.rooms.selectedRoom?.toJSON());

    this.$el.html(html);

    return this;
  }
}
