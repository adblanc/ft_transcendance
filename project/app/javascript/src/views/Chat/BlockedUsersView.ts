import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import { currentUser } from "src/models/Profile";

export default class BlockedUsersView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.listenTo(currentUser(), "change:blocked_users", this.render);
  }

  render() {
    const template = $("#blocked-users-list-template").html();
    console.log(currentUser().toJSON());
    const html = Mustache.render(template, currentUser().toJSON());
    this.$el.html(html);

    return this;
  }
}
