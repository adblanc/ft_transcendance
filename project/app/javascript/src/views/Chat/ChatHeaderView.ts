import Backbone from "backbone";
import Mustache from "mustache";
import Rooms from "src/collections/Rooms";
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

    console.log("rooms", this.rooms);

    this.listenTo(this.rooms, "change", this.render);
  }

  render() {
    const template = $("#chat-header-template").html();
    const html = Mustache.render(template, {
      room_name: this.rooms.selectedRoom?.get("name") || "",
    });

    console.log("on render html", html);
    this.$el.html(html);

    return this;
  }
}
