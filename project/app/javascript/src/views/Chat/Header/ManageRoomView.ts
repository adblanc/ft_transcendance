import Backbone from "backbone";
import Mustache from "mustache";
import Room from "src/models/Room";
import { displaySuccess } from "src/utils";
import ModalView from "src/views/ModalView";

export default class ManageRoomView extends ModalView<Room> {
  constructor(options?: Backbone.ViewOptions<Room>) {
    super(options);

    if (!this.model)
      throw Error("Please provide a profile model to ModifyProfileView");
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
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
