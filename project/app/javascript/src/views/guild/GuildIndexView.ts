import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";
import NavbarView from "../NavbarView";
import Guild from "src/models/Guild";
import CreateGuildView from "./CreateGuildView";

export default class GuildView extends BaseView {
  navbarView: Backbone.View;
  //model: Backbone.Model;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

	this.navbarView = new NavbarView();
  }

  events() {
    return {
      "click #create-btn": "onCreateClicked",
    };
  }

  onCreateClicked() {
	const guild = new Guild();
    const createGuildView = new CreateGuildView({
      model: guild,
	});

    createGuildView.render();
  }

  render() {
    const template = $("#guildIndexTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	this.renderNested(this.navbarView, "#index-navbar");

    return this;
  }

}
