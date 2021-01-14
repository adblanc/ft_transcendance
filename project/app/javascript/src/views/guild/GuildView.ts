import Backbone from "backbone";
import Mustache from "mustache";
import InfoView from "./InfoView";
import MembersView from "./MembersView";
import Guild from "src/models/Guild";
import BaseView from "src/lib/BaseView";

type Options = Backbone.ViewOptions & { guild: Guild };

export default class GuildView extends BaseView {
  infoView: Backbone.View;
  membersView: Backbone.View;
  guild: Guild;

  constructor(options?: Options) {
    super(options);

    this.guild = options.guild;

    this.infoView = new InfoView({
      guild: this.guild,
    });
    this.membersView = new MembersView({
      guild: this.guild,
    });
    this.guild.fetch({
      error: () => {
        Backbone.history.navigate("/not-found", { trigger: true });
      },
    });
    //displaySuccess(
    // `You have successfully transferred ownership to ${this.guild.get(
    //    "name")}. You are now an officer.`);

    this.listenTo(this.guild, "change", this.render);
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
