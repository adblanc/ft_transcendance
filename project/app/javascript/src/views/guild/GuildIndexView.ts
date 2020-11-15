import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";
import NavbarView from "../NavbarView";
import InfoView from "./InfoView";
import MembersView from "./MembersView";
import Guild from "src/models/Guild";

export default class GuildView extends BaseView {
  navbarView: Backbone.View;
  //will have a boardview

  constructor(options?: Backbone.ViewOptions) {
    super(options);

	this.navbarView = new NavbarView();
  }

  render() {
    const template = $("#guildIndexTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	this.renderNested(this.navbarView, "#index-navbar");

    return this;
  }

}
