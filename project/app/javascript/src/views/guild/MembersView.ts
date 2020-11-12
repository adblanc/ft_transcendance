import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";
import NavbarView from "../NavbarView";
import Members from "src/collections/Members";
import Member from "src/models/Member";

export default class MembersView extends BaseView {
  members: Backbone.Collection;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.members = new Members();
  }

  render() {
    const template = $("#membersTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}