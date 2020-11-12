import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";
import NavbarView from "../NavbarView";
import InfoView from "./InfoView";
import MembersView from "./MembersView";

export default class GuildView extends BaseView {
  navbarView: Backbone.View;
  infoView: Backbone.View;
  membersView: Backbone.View;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

	this.navbarView = new NavbarView();
	this.infoView = new InfoView();
	this.membersView = new MembersView();
  }

  render() {
    const template = $("#guildPageTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	this.renderNested(this.navbarView, "#index-navbar");
	this.renderNested(this.infoView, "#info");
	this.renderNested(this.membersView, "#members");

	//render member collection through another template than the guild page template?

    return this;
  }

}
