import Backbone from "backbone";
import Mustache from "mustache";
import PublicRooms from "src/collections/PublicRooms";
import BaseView from "src/lib/BaseView";
import PublicRoom from "src/models/PublicRoom";

type Options = Backbone.ViewOptions & {
  publicRooms: PublicRooms;
};

const PUBLIC_ROOMS_VIEW_INFOS = {
  label: "Public channels list",
  id: "public-rooms-list",
};

export default class PublicRoomsView extends BaseView {
  publicRooms: PublicRooms;

  constructor(options?: Options) {
    super(options);

    this.publicRooms = new PublicRooms();
    this.publicRooms.fetch();

    this.listenTo(this.publicRooms, "add", this.renderPublicRoom);
  }

  events() {
    return {
      "click .room-name": this.onClick,
    };
  }

  onClick() {
    console.log("public room clicked");
  }

  renderPublicRoom(room: PublicRoom) {
    console.log("render public room", room);
  }

  render() {
    const template = $("#rooms-list-template").html();
    const html = Mustache.render(template, PUBLIC_ROOMS_VIEW_INFOS);
    this.$el.html(html);

    return this;
  }
}
