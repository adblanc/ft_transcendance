import Backbone from "backbone";
import Mustache from "mustache";
import NavbarView from "../NavbarView";
import InfoView from "./InfoView";
import MembersView from "./MembersView";
import PageView from "src/lib/PageView";
import Guild from "src/models/Guild"
import Profile from "src/models/Profile";

type Options = Backbone.ViewOptions & { guild: Guild};

export default class GuildView extends PageView {
  navbarView: Backbone.View;
  infoView: Backbone.View;
  membersView: Backbone.View;
  guild: Guild;
  profile: Profile;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.profile = new Profile();

    this.navbarView = new NavbarView();
    this.infoView = new InfoView({
	  guild: this.guild,
	  profile: this.profile,
    });
    this.membersView = new MembersView({
	  guild: this.guild,
	  profile: this.profile,
    });
	this.guild.fetch();
	this.profile.fetch();
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
