import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import RoomUser from "src/models/RoomUser";
import { displaySuccess } from "src/utils";

export default class RoomUserView extends BaseView<RoomUser> {
  constructor(options?: Backbone.ViewOptions<RoomUser>) {
    super(options);

    this.listenTo(this.model, "change", this.render);
  }

  events() {
    return {
      "click #promote": () => this.updateRole("promote"),
      "click #demote": () => this.updateRole("demote"),
    };
  }

  updateRole(action: "promote" | "demote") {
    const success = this.model.updateRole(action);

    if (success) {
      displaySuccess(`${this.model.get("login")} has been ${action}d`);
    }
  }

  render() {
    const template = $("#room-user-template").html();
    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      isCurrentUser:
        $("#current-user-profile").data("login") === this.model.get("login"),
      canPromote: !this.model.get("isRoomAdministrator"),
      canDemote: this.model.get("isRoomAdministrator"),
    });
    this.$el.html(html);

    return this;
  }
}
