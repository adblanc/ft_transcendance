import Backbone from "backbone";
import Mustache from "mustache";
import Profiles from "src/collections/Profiles";
import MemberView from "./MemberView";
import PendingView from "./PendingView";
import Guild from "src/models/Guild";
import Profile from "src/models/Profile";

type Options = Backbone.ViewOptions & { guild: Guild, profile: Profile };

export default class MembersView extends Backbone.View {
  profile: Profile;
  profiles: Profiles;
  guild: Guild;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.profile = options.profile;
	this.profiles = this.guild.get("users");

	this.listenTo(this.guild, "change", this.render);
	this.listenTo(this.profile, "change", this.render);
	this.listenTo(this.profiles, "update", this.render);
	
  }

  events() {
    return {
	  "click #pending-btn": "onPendingClicked",
    };
  }

  onPendingClicked() {
    const pendingView = new PendingView({
	  model: this.guild,
    });

    pendingView.render();
  }

  render() {
    const template = $("#membersTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
	this.$el.html(html);

	if (this.profile.get("guild")) {
		if (this.profile.get("guild").get('id') === this.guild.get('id') &&
			(this.profile.get("guild_role") === "Owner" || this.profile.get("guild_role") === "Officer")) {
				this.$("#pending").show();
		}
	}
	
	const $element = this.$("#listing");
	
    this.profiles.forEach(function (item) {
      var memberView = new MemberView({
		model: item,
		loggedIn: this.profile,
		guild: this.guild,
      });
      $element.append(memberView.render().el);
	}, this);
	

    return this;
  }
}
