import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "./BaseView";
import NavbarView from "./NavbarView";
import Members from "src/collections/Members";
import Member from "src/models/Member";

export default class GuildView extends BaseView {
  navbarView: Backbone.View;
  members: Backbone.Collection;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.navbarView = new NavbarView();

    this.members = new Members();
  }

  render() {
    const template = $("#guildPageTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.renderNested(this.navbarView, "#index-navbar");

	//render member collection through another template than the guildpagetemplate?

    return this;
  }

}
