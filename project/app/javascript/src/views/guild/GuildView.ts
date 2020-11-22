import Backbone from "backbone";
import Mustache from "mustache";
import NavbarView from "../NavbarView";
import InfoView from "./InfoView";
import MembersView from "./MembersView";
import PageView from "src/lib/PageView";

type Options = Backbone.ViewOptions & { guild: Backbone.AssociatedModel };

export default class GuildView extends PageView {
  navbarView: Backbone.View;
  infoView: Backbone.View;
  membersView: Backbone.View;
  guild: Backbone.AssociatedModel;

  constructor(options?: Options) {
    super(options);

    this.guild = options.guild;
    this.navbarView = new NavbarView();
    this.infoView = new InfoView({
      guild: this.guild,
    });
    this.membersView = new MembersView({
      guild: this.guild,
    });
	this.guild.fetch({
		success: () => {
		  console.log("users", this.guild.get("users[0]"));
		},
	  });
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
