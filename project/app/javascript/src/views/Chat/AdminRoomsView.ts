import Backbone from "backbone";
import Mustache from "mustache";
import AdminRooms from "src/collections/AdminRooms";
import BaseView from "src/lib/BaseView";
import AdminRoom from "src/models/AdminRoom";
import AdminRoomView from "./AdminRoomView";

type Options = Backbone.ViewOptions & {
  adminRooms: AdminRooms;
};

const ADMIN_ROOMS_VIEW_INFOS = {
  label: "Admin channels list",
  id: "admin-rooms-list",
};

export default class AdminRoomsView extends BaseView {
	adminRooms: AdminRooms;

  constructor(options?: Options) {
    super(options);

    this.adminRooms = new AdminRooms();
    this.adminRooms.fetch();

    this.listenTo(this.adminRooms, "add", this.renderAdminRoom);
    this.listenTo(this.adminRooms, "remove", this.removeAdminRoom);
  }

  renderAdminRoom(room: AdminRoom) {
    this.$("#admin-rooms-list").append(
      new AdminRoomView({ model: room }).render().el
    );
  }

  removeAdminRoom(room: AdminRoom) {
    this.$(`#room-${room.get("id")}`)
      .parent()
      .remove();
  }

  render() {
    const template = $("#rooms-list-template").html();
    const html = Mustache.render(template, ADMIN_ROOMS_VIEW_INFOS);
    this.$el.html(html);

    return this;
  }
}
