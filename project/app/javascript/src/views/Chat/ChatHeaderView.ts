import Backbone from "backbone";
import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import BaseView from "src/lib/BaseView";
import { displaySuccess } from "src/utils";
import _ from "underscore";

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

  render() {
    const template = $("#chat-header-template").html();
    const html = Mustache.render(template, {
      room_name: this.rooms.selectedRoom?.get("name") || "",
    });

    this.$el.html(html);

    return this;
  }
}
