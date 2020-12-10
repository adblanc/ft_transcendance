import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import RoomUser from "src/models/RoomUser";

export default class RoomUserView extends BaseView<RoomUser> {
  render() {
    const template = $("#room-user-template").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}
