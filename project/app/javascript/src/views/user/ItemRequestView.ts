import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import User from "src/models/User";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { model: User, user: User };

export default class ItemRequestView extends BaseView {
  model: User;
  user: User;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
	this.user = options.user;
  }

  events() {
    return {
      "click #accept-btn": "onAcceptClicked",
      "click #refuse-btn": "onRefuseClicked",
    };
  }

  async onAcceptClicked() {
    const success = await this.model.acceptFriend();

    if (success) {
      this.saved("accepted");
    }
  }

  async onRefuseClicked() {
    const success = await this.model.refuseFriend();

    if (success) {
      this.saved("refused");
    }
  }

  saved(method: "accepted" | "refused") {
    switch (method) {
      case "accepted":
        displaySuccess(
          `You accepted ${this.model.get("name")}'s friend request`
        );
        break;
      case "refused":
        displaySuccess(
          `You refused ${this.model.get("name")}'s friend request`
        );
        break;
    }
    this.user.fetch();
  }

  render() {
    const template = $("#requestItemTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);

    return this;
  }
}
