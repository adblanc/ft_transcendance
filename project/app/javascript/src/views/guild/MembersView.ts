import Backbone from "backbone";
import Mustache from "mustache";
import Profiles from "src/collections/Profiles";
import MemberView from "./MemberView";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions & { guild: Guild };

export default class MembersView extends Backbone.View {
  profiles: Profiles;
  guild: Guild;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.profiles = this.guild.get("users");

	this.listenTo(this.guild, "change", this.render);
	
  }

  render() {
    const template = $("#membersTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
	this.$el.html(html);
	
	const $element = this.$("#listing");

    this.profiles.forEach(function (item) {
      var memberView = new MemberView({
        model: item,
      });
      $element.append(memberView.render().el);
    });
    return this;
  }
}
