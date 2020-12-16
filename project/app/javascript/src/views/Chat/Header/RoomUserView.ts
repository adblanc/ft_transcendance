import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import RoomUser from "src/models/RoomUser";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions<RoomUser> & {
  isCurrentUserOwner: boolean;
};

export default class RoomUserView extends BaseView<RoomUser> {
  isCurrentUserOwner: boolean;
  constructor(options?: Options) {
    super(options);

    this.listenTo(this.model, "change", this.render);

    this.isCurrentUserOwner = options.isCurrentUserOwner;
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

    const isCurrentUser =
      $("#current-user-profile").data("login") === this.model.get("login");

    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      showButtons: !isCurrentUser && this.isCurrentUserOwner,
      canPromote: this.model.canBePromote(),
      canDemote: this.model.canBeDemote(),
    });
    this.$el.html(html);

    return this;
  }
}
