import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import PageImgView from "./imgsViews/PageImgView";
import Profile from "src/models/Profile"
import Guild from "src/models/Guild"
import ModifyGuildView from "./ModifyGuildView";

type Options = Backbone.ViewOptions & { guild: Guild };

export default class InfoView extends BaseView {
  profile: Profile;
  guild: Guild;
  imgView: Backbone.View;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.imgView = new PageImgView({
		model: this.guild,
	});

	this.profile = new Profile();

	this.listenTo(this.guild, "change", this.render);
	this.listenTo(this.profile, "change", this.render);
  }

  events() {
    return {
	  "click #edit-btn": "onEditClicked",
	  //"click #quit-btn": "onQuitClicked",
    };
  }

  onEditClicked() {
    const modifyGuildView = new ModifyGuildView({
	  model: this.guild,
    });

    modifyGuildView.render();
  }

  /*onQuitClicked() {
   this.guild.quit();
  }*/


  render() {
    const template = $("#infoTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
	this.$el.html(html);

	const $elementedit = this.$("#edit-btn");
	const $elementquit = this.$("#quit-btn");
	const $elementwar = this.$("#war-btn");

	this.profile.fetch({
		success: () => {
			if (this.profile.get("guild").get('id') === this.guild.get('id') &&
					this.profile.get("guild_role") === "Owner") {
				$elementedit.show();
			}
			if (this.profile.get("guild").get('id') === this.guild.get('id')) {
				$elementquit.show();
			}
			else {
				$elementwar.show();
			}
		},
	});
	
	this.renderNested(this.imgView, "#pageImg");

    return this;
  }
}
