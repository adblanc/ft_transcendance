import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";
import NavbarView from "../NavbarView";
import InfoView from "./InfoView";
import MembersView from "./MembersView";
import Guild from "src/models/Guild";

//type Options = Backbone.ViewOptions & {idd: string};
type Options = Backbone.ViewOptions & {guild: Backbone.Model};

export default class GuildView extends BaseView {
  navbarView: Backbone.View;
  infoView: Backbone.View;
  membersView: Backbone.View;
  guild: Backbone.Model;
  //id: string;

  constructor(options?: Options) {
    super(options);

	//this.id = options.idd;
	//this.guild = new Guild({id: this.id});
	this.guild = options.guild;
	this.navbarView = new NavbarView();
	this.infoView = new InfoView({
		guild: this.guild,
	});
	this.guild.fetch();
	this.membersView = new MembersView({
		guild: this.guild,
	});
	this.guild.fetch();
  }

  render() {
    const template = $("#guildPageTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	this.renderNested(this.navbarView, "#index-navbar");
	this.renderNested(this.infoView, "#info");
	this.renderNested(this.membersView, "#members");

    return this;
  }

}
