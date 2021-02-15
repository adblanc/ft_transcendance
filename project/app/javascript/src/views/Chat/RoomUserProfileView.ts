import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import { currentUser } from "src/models/Profile";
import Room from "src/models/Room";
import RoomUser, { MuteBanTime } from "src/models/RoomUser";
import { displaySuccess } from "src/utils";
import ModalView from "../ModalView";

type Options = Backbone.ViewOptions<RoomUser> & {
  currentRoomUser: RoomUser;
};

type Action =
  | "muted"
  | "banned"
  | "blocked"
  | "unblocked"
  | "unmuted"
  | "unbanned"
  | "promoted"
  | "demoted";

export default class RoomUserProfileView extends ModalView<RoomUser> {
  currentRoomUser?: RoomUser;

  constructor(options?: Options) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a RoomUser model to this view.");
    }

    this.currentRoomUser = options.currentRoomUser;
  }

  events() {
    return {
      ...super.events(),
      "click #mute-list > option": (e) => this.performAction(e, "muted"),
      "click #ban-list > option": (e) => this.performAction(e, "banned"),
      "click #block-user": (e) => this.performAction(e, "blocked"),
      "click #unblock-user": (e) => this.performAction(e, "unblocked"),
      "click #unmute-user": (e) => this.performAction(e, "unmuted"),
      "click #unban-user": (e) => this.performAction(e, "unbanned"),
      "click #promote-user": (e) => this.performAction(e, "promoted"),
      "click #demote-user": (e) => this.performAction(e, "demoted"),
      "click #dm-user": this.sendDm,
    };
  }

  async performAction({ currentTarget }: JQuery.ClickEvent, action: Action) {
    let success = false;

    let time: MuteBanTime = undefined;
    let timeLabel: string = undefined;

    switch (action) {
      case "banned":
        time = $(currentTarget).val() as MuteBanTime;
        timeLabel = $(currentTarget).text();
        success = await this.model.ban(this.model.room.get("id"), time);
        break;
      case "muted":
        time = $(currentTarget).val() as MuteBanTime;
        timeLabel = $(currentTarget).text();
        success = await this.model.mute(this.model.room.get("id"), time);
        break;
      case "blocked":
        success = await currentUser().blockUser(this.model.get("id"));
        if (success) {
          this.model.set({ isBlocked: true });
        }
        break;
      case "unblocked":
        success = await currentUser().unBlockUser(this.model.get("id"));
        this.model.set({ isBlocked: false });
        break;
      case "unbanned":
        success = await this.model.unBan(this.model.room.get("id"));
        break;
      case "unmuted":
        success = await this.model.unMute(this.model.room.get("id"));
        break;
      case "promoted":
        success = await this.model.updateRole(action);
        break;
      case "demoted":
        success = await this.model.updateRole(action);
        break;
      default:
        throw new Error("Please provide a valid action");
    }

    if (success) {
      this.closeModal();
      displaySuccess(
        `You successfully ${action} ${this.model.get("login")} ${
          time
            ? `${timeLabel !== "Indefinitely" ? `for ${timeLabel}` : timeLabel}`
            : ""
        }`
      );
    }
  }

  async sendDm() {
    eventBus.trigger("chat:go-to-dm", this.model.get("id"));
    this.closeAllModal();
  }

  render() {
    super.render(); // we render the modal
    const template = $("#room-user-profile-template").html();

    const html = Mustache.render(template, {
      ...this.model?.toJSON(),
      isCurrentUser: this.model.get("id") === currentUser().get("id"),
      isInRoom: this.model.get("roomRole") !== "Former member",
      isDm: this.currentRoomUser?.room.get("is_dm"),
      isAdmin:
        this.currentRoomUser?.get("isRoomAdministrator") ||
        currentUser().get("admin"),
      isOwner:
        this.currentRoomUser?.room.get("isOwner") || currentUser().get("admin"),
      canPromote: this.model.canBePromote(),
      canDemote: this.model.canBeDemote(),
    });
    this.$content.html(html);
    return this;
  }
}
