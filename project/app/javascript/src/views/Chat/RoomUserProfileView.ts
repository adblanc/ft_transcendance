import Backbone from "backbone";
import Mustache from "mustache";
import Message from "src/models/Message";
import { currentUser } from "src/models/Profile";
import RoomUser from "src/models/RoomUser";
import { displayError, displaySuccess } from "src/utils";
import ModalView from "../ModalView";

type Options = Backbone.ViewOptions<Message> & {
  isRoomAdministrator?: boolean;
  sender?: RoomUser;
};

export default class RoomUserProfileView extends ModalView<Message> {
  isRoomAdministrator?: boolean;
  sender?: RoomUser;

  constructor(options?: Options) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a Message model to this view.");
    }

    this.isRoomAdministrator = options.isRoomAdministrator;
    this.sender = options.sender;
  }

  events() {
    return {
      ...super.events(),
      "click #invite-to-play-user": this.inviteToPlay,
      "click #block-user": this.blockUser,
      "click #mute-user": this.muteUser,
      "click #unmute-user": this.unMuteUser,
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
    if (!this.sender) {
      return displayError("This user is no longer in the room.");
    }

    const success = await this.sender.mute(this.model.get("room_id"));

    if (success) {
      displaySuccess(`You successfully muted ${this.model.get("user_login")}`);
    }
  }

  async unMuteUser() {
    if (!this.sender) {
      return displayError("This user is no longer in the room.");
    }

    const success = await this.sender.unMute(this.model.get("room_id"));

    if (success) {
      displaySuccess(
        `You successfully unmuted ${this.model.get("user_login")}`
      );
    }
  }

  async banUser() {
    if (!this.sender) {
      return displayError("This user is no longer in the room.");
    }

    const success = await this.sender.ban(this.model.get("room_id"));

    if (success) {
      displaySuccess(`You successfully banned ${this.model.get("user_login")}`);
    }
  }

  render() {
    super.render(); // we render the modal
    const template = $("#room-user-profile-template").html();

    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      isAdmin: this.isRoomAdministrator,
      isCurrentUser: this.model.get("user_id") === currentUser().get("id"),
      ...(this?.sender.toJSON() || {}),
    });
    this.$content.html(html);
    return this;
  }
}
