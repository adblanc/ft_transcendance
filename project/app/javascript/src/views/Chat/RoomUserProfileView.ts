import Backbone from "backbone";
import Mustache from "mustache";
import Message from "src/models/Message";
import RoomUser from "src/models/RoomUser";
import { displaySuccess } from "src/utils";
import ModalView from "../ModalView";

type Options = Backbone.ViewOptions<Message> & {
  currentUser: RoomUser;
};

export default class RoomUserProfileView extends ModalView<Message> {
  currentUser: RoomUser;

  constructor(options?: Options) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Message model to this view.");
    }

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

  async muteUser() {
    const success = await this.currentUser.muteUser(this.model.get("user_id"));

    if (success) {
      displaySuccess(`You successfully muted ${this.model.get("user_login")}`);
    }
  }

  banUser() {
    console.log("ban user");
  }

  render() {
    console.log("render user profile");
    super.render(); // we render the modal
    const template = $("#room-user-profile-template").html();

    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      isAdmin: this.currentUser.get("isRoomAdministrator"),
      isCurrentUser: this.model.get("user_id") === this.currentUser.get("id"),
    });
    this.$content.html(html);
    return this;
  }
}
