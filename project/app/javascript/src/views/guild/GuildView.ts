import Backbone from "backbone";
import Mustache from "mustache";
import InfoView from "./InfoView";
import MembersView from "./MembersView";
import Guild from "src/models/Guild";
import Profile from "src/models/Profile";
import BaseView from "src/lib/BaseView";

type Options = Backbone.ViewOptions & { guild: Guild };

export default class GuildView extends BaseView {
  infoView: Backbone.View;
  membersView: Backbone.View;
  guild: Guild;
  profile: Profile;

  constructor(options?: Options) {
    super(options);

    this.guild = options.guild;
    this.profile = new Profile();

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
	
	this.listenTo(this.guild, "change", this.render);
	this.listenTo(this.profile, "change", this.render);

  }

  render() {
    const template = $("#guildPageTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.renderNested(this.infoView, "#info");
    this.renderNested(this.membersView, "#members");

    return this;
  }
}
