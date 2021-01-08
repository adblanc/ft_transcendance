import Backbone from "backbone";
import Mustache from "mustache";
import { currentUser } from "src/models/Profile";
import RoomUser from "src/models/RoomUser";
import { displaySuccess } from "src/utils";
import ModalView from "../ModalView";

type Options = Backbone.ViewOptions<RoomUser> & {
  currentRoomUser: RoomUser;
};

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
      "click #block-user": this.blockUser,
      "click #mute-user": this.muteUser,
      "click #unmute-user": this.unMuteUser,
      "click #ban-user": this.banUser,
      "click #unban-user": this.unBanUser,
    };
  }

  inviteToPlay() {
    console.log("invite to play");
  }

  async blockUser() {
    const success = await currentUser().blockUser(this.model.get("id"));

    if (success) {
      displaySuccess(`You successfully blocked ${this.model.get("login")}`);
    }
  }

  async muteUser() {
    const success = await this.model.mute(this.model.room.get("id"));

    if (success) {
      displaySuccess(`You successfully muted ${this.model.get("login")}`);
    }
  }

  async unMuteUser() {
    const success = await this.model.unMute(this.model.room.get("id"));

    if (success) {
      displaySuccess(`You successfully unmuted ${this.model.get("login")}}`);
    }
  }

  async banUser() {
    const success = await this.model.ban(this.model.room.get("id"));

    if (success) {
      displaySuccess(`You successfully banned ${this.model.get("login")}}`);
    }
  }

  async unBanUser() {
    const success = await this.model.unBan(this.model.room.get("id"));

    if (success) {
      displaySuccess(`You successfully unbanned ${this.model.get("login")}}`);
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
