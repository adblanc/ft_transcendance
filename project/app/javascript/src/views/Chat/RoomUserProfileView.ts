import Backbone from "backbone";
import Mustache from "mustache";
import RoomUser from "src/models/RoomUser";
import ModalView from "../ModalView";

type Options = Backbone.ViewOptions<RoomUser> & {
  currentUser: RoomUser;
};

export default class RoomUserProfileView extends ModalView<RoomUser> {
  currentUser: RoomUser;

  constructor(options?: Options) {
    super(options);

    if (!this.model)
      throw Error("Please provide a room user model to RoomUserProfileView");

    if (!options.currentUser)
      throw Error("Please provide a current user to RoomUserProfileView");

    this.currentUser = options.currentUser;
  }

  events() {
    return {
      ...super.events(),
      "click #invite-to-play-user": this.inviteToPlay,
      "click #block-user": this.blockUser,
      "click #mute-user": this.muteUser,
      "click #ban-user": this.banUser,
    };
  }

  inviteToPlay() {
    console.log("invite to play");
  }

  blockUser() {
    console.log("block user");
  }

  muteUser() {
    console.log("mute user");
  }

  banUser() {
    console.log("ban user");
  }

  render() {
    super.render(); // we render the modal
    const template = $("#room-user-profile-template").html();

    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      isAdmin: this.currentUser.get("isRoomAdministrator"),
      isCurrentUser: this.model.get("id") === this.currentUser.get("id"),
    });
    this.$content.html(html);
    return this;
  }
}
