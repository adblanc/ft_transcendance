import Backbone from "backbone";
import Mustache from "mustache";
import RoomUser from "src/models/RoomUser";
import ModalView from "../ModalView";

export default class RoomUserProfileView extends ModalView<RoomUser> {
  constructor(options?: Backbone.ViewOptions<RoomUser>) {
    super(options);

    if (!this.model)
      throw Error("Please provide a room user model to RoomUserProfileView");
  }

  events() {
    return {
      ...super.events(),
      "click #invite-to-play-user": this.inviteToPlay,
      "click #block-user": this.blockUser,
    };
  }

  inviteToPlay() {
    console.log("invite to play");
  }

  blockUser() {
    console.log("block user");
  }

  render() {
    super.render(); // we render the modal
    const template = $("#room-user-profile-template").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
