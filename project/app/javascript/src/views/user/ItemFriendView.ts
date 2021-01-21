import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import User from "src/models/User";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { model: User};

export default class ItemFriendView extends BaseView {
  model: User;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  events() {
    return {
	  "click #remove-friend": this.onRemoveFriend,
    };
  }

  async onRemoveFriend() {
    const success = await this.model.removeFriend();

    if (success) {
      displaySuccess(
        `Your are no longer friend with ${this.model.get("login")}`
	  );
    }
  }

  render() {
    const template = $("#friendItemTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);

    return this;
  }
}
