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
    };
  }

  onEditClicked() {
    const modifyGuildView = new ModifyGuildView({
	  model: this.guild,
    });

    modifyGuildView.render();
  }


  render() {
    const template = $("#infoTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
	this.$el.html(html);

	const $element = this.$("#edit-btn");

	this.profile.fetch({
		success: () => {
			if (this.profile.get("guild").get('id') === this.guild.get('id') &&
					this.profile.get("guild_role") === "Owner") {
				$element.show();
			}
		},
	});
	
	this.renderNested(this.imgView, "#pageImg");

    return this;
  }
}
