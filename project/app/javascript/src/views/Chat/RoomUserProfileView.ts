import Backbone from "backbone";
import Mustache from "mustache";
import { currentUser } from "src/models/Profile";
import RoomUser, { MuteBanTime } from "src/models/RoomUser";
import { displaySuccess } from "src/utils";
import ModalView from "../ModalView";

type Options = Backbone.ViewOptions<RoomUser> & {
  currentRoomUser: RoomUser;
};

type Action = "muted" | "banned" | "blocked" | "unmuted" | "unbanned";

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
      "click #invite-to-play-user": this.inviteToPlay,
      "click #mute-list > option": (e) => this.performAction(e, "muted"),
      "click #ban-list > option": (e) => this.performAction(e, "banned"),
      "click #block-user": (e) => this.performAction(e, "blocked"),
      "click #unmute-user": (e) => this.performAction(e, "unmuted"),
      "click #unban-user": (e) => this.performAction(e, "unbanned"),
    };
  }

  inviteToPlay() {
    console.log("invite to play");
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
        break;
      case "unbanned":
        success = await this.model.unBan(this.model.room.get("id"));
        break;
      case "unmuted":
        success = await this.model.unMute(this.model.room.get("id"));
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

  render() {
    super.render(); // we render the modal
    const template = $("#room-user-profile-template").html();

    const html = Mustache.render(template, {
      ...this.model?.toJSON(),
      isCurrentUser: this.model.get("id") === currentUser().get("id"),
      isAdmin: this.currentRoomUser.get("isRoomAdministrator"),
    });
    this.$content.html(html);
    return this;
  }
}
