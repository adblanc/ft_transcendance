import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile from "src/models/Profile";
import Guild from "src/models/Guild";
import ManageMemberView from "./ManageMemberView";

type Options = Backbone.ViewOptions & { model: Profile, loggedIn: Profile, guild: Guild };

export default class MemberView extends BaseView {
  model: Profile;
  loggedIn: Profile;
  guild: Guild;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
	this.loggedIn = options.loggedIn;
	this.guild = options.guild;

	this.listenTo(this.model, "change", this.render);
	this.listenTo(this.model, "add", this.render);
	this.listenTo(this.guild, "change", this.render);
	this.listenTo(this.guild.get("members"), "update", this.render);
	//console.log(this.model);
  }

  events() {
    return {
	  "click #manage-btn": "onManageClicked",
    };
  }

  onManageClicked() {
    const manageMemberView = new ManageMemberView({
	  model: this.model,
	  guild: this.guild,
    });

    manageMemberView.render();
  }

  render() {
    const template = $("#memberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);

	const $element = this.$("#manage-btn");
	if (this.loggedIn.get("guild")) {
		if (this.loggedIn.get("guild").get('id') === this.guild.get('id') &&
			this.loggedIn.get("guild_role") === "Owner" &&
			this.loggedIn.get('id') != this.model.get('id')) {
				$element.show();
		}
	}

    return this;
  }
}
