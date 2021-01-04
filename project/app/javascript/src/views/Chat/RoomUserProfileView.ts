import Backbone from "backbone";
import Mustache from "mustache";
import Message from "src/models/Message";
import { currentUser } from "src/models/Profile";
import RoomUser from "src/models/RoomUser";
import { displaySuccess } from "src/utils";
import ModalView from "../ModalView";

type Options = Backbone.ViewOptions<Message> & {
  isRoomAdministrator?: boolean;
};

export default class RoomUserProfileView extends ModalView<Message> {
  isRoomAdministrator?: boolean;

  constructor(options?: Options) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Message model to this view.");
    }

    this.isRoomAdministrator = options.isRoomAdministrator;
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

  async blockUser() {
    const success = await currentUser().blockUser(this.model.get("user_id"));

    if (success) {
      displaySuccess(
        `You successfully blocked ${this.model.get("user_login")}`
      );
    }
  }

  async muteUser() {
    console.log("mute user");
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
      isAdmin: this.isRoomAdministrator,
      isCurrentUser: this.model.get("user_id") === currentUser().get("id"),
    });
    this.$content.html(html);
    return this;
  }
}
