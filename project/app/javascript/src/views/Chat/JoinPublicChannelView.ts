import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";

import PublicRoom from "src/models/PublicRoom";
import { displaySuccess } from "src/utils";
import ModalView from "../ModalView";

export default class JoinPublicChannelView extends ModalView<PublicRoom> {
  constructor(options: Backbone.ViewOptions<PublicRoom>) {
    super(options);

    if (!this.model) {
      throw Error("Please provide a PublicRoom model.");
    }
  }

  events() {
    return {
      ...super.events(),
      "click #join-public-channel": this.joinPublicChannel,
    };
  }

  async joinPublicChannel() {
    const success = await this.model.join();

    if (success) {
      displaySuccess(`Room ${this.model.get("name")} successfully joined`);
      eventBus.trigger("chat:channel-joined", this.model);
      this.model.collection.remove(this.model);
    }
    this.closeModal();
  }

  render() {
    super.render(); // we render the modal
    const template = $("#join-public-channel-template").html();

    const owner = this.model
      .get("users")
      .find((u) => u.get("roomRole") === "Owner");

    const members = this.model
      .get("users")
      .filter((u) => u.get("roomRole") !== "Owner")
      .map((u) => u.toJSON());

    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      ownerLogin: owner?.get("login"),
      ownerAvatar: owner?.get("avatar_url"),
      ownerRole: owner?.get("roomRole"),
      members,
      membersEmpty: members.length === 0,
    });
    this.$content.html(html);

    return this;
  }
}
