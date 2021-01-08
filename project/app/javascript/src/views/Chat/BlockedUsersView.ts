import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import { currentUser } from "src/models/Profile";
import { displaySuccess } from "src/utils";

export default class BlockedUsersView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.listenTo(currentUser(), "change:blocked_users", this.render);
  }

  events() {
    return {
      "click #unblock-user": this.unBlockUser,
    };
  }

  async unBlockUser({ currentTarget }: JQuery.ClickEvent) {
    const id = $(currentTarget).data("user_id");

    const success = await currentUser().unBlockUser(id);

    if (success) {
      const login = $(currentTarget).data("user_login");
      displaySuccess(`Successfully unblocked ${login}.`);
    }
  }

  render() {
    const template = $("#blocked-users-list-template").html();
    const html = Mustache.render(template, currentUser().toJSON());
    this.$el.html(html);

    return this;
  }
}
