import Backbone from "backbone";
import Mustache from "mustache";
import Room from "src/models/Room";
import { displaySuccess } from "src/utils";
import ModalView from "src/views/ModalView";
import RoomUsersView from "./RoomUsersView";

export default class ManageRoomView extends ModalView<Room> {
  constructor(options?: Backbone.ViewOptions<Room>) {
    super(options);

    if (!this.model)
      throw Error("Please provide a room model to ModifyProfileView");
  }

  events() {
    return { ...super.events(), "click #room-submit": this.onSubmit };
  }

  async onSubmit(e: JQuery.Event) {
    e.preventDefault();

    const password = this.$("#input-room-password").val() as string;

    const success = await this.model.modifyPassword(password);

    if (success) {
      displaySuccess(
        `${this.model.get("name")}'s password successfully changed.`
      );
      this.closeModal();
    }
  }

  render() {
    super.render(); // we render the modal
    const template = $("#manage-room-template").html();

    const users = this.model.get("users");
    const currentUser = users.find(
      (u) => u.get("login") === $("#current-user-profile").data("login")
    );

    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      isRoomAdministrator: currentUser?.get("isRoomAdministrator"),
    });

    this.$content.html(html);

    this.renderNested(
      new RoomUsersView({
        roomUsers: this.model.get("users"),
        isCurrentUserOwner: currentUser.get("roomRole") === "Owner",
      }),
      "#room-users-list"
    );

    return this;
  }
}
