import Backbone from "backbone";
import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
import { displayToast } from "src/utils";
import _ from "underscore";

type Options = Backbone.ViewOptions & {
  rooms: Rooms;
};

export default class ChatHeaderView extends Backbone.View {
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

    try {
      await selectedRoom.quit();
      displayToast(
        {
          text: `Room ${selectedRoom.get("name")} successfully left`,
        },
        "success"
      );
    } catch (err) {
      displayToast({ text: err }, "error");
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
