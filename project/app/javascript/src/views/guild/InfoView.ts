import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import PageImgView from "./imgsViews/PageImgView";
import Profile from "src/models/Profile"
import Guild from "src/models/Guild"
import ModifyGuildView from "./ModifyGuildView";
import { displayToast } from "src/utils/toast";
import MainRouter from "src/routers/MainRouter";

type Options = Backbone.ViewOptions & { guild: Guild, profile: Profile };

export default class InfoView extends BaseView {
  profile: Profile;
  guild: Guild;
  imgView: Backbone.View;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.profile = options.profile;
	this.imgView = new PageImgView({
		model: this.guild,
	});

	this.listenTo(this.guild, "change", this.render);
	this.listenTo(this.profile, "change", this.render);

  }

  events() {
    return {
	  "click #edit-btn": "onEditClicked",
	  "click #quit-btn": "onQuitClicked",
	  "click #join-btn": "onJoinClicked",
	  "click #withdraw-btn": "onWithdrawClicked",
    };
  }

  onEditClicked() {
    const modifyGuildView = new ModifyGuildView({
	  model: this.guild,
    });

    modifyGuildView.render();
  }

  onQuitClicked() {
	this.guild.quit(
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.guildQuit()
		);
  }

  guildQuit() {
	displayToast({ text: `You have successfully quit ${this.guild.get('name')}. ` }, "success");
	this.guild.fetch();
	this.profile.fetch();
	if (this.guild.get('members').length == 0) {
		displayToast({ text: `You were the only member of ${this.guild.get('name')}, so the guild was destroyed.` }, "success");
		const router = new MainRouter();
		router.navigate("notFound", { trigger: true });
		return;
	}
	else if (this.profile.get('guild_role') == "Owner") {
		displayToast({ text: `Your owner privileges were transferred to ${this.guild.get('name')}'s oldest member.` }, "success");
	}
  }

  onJoinClicked() {
	this.guild.join(
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.guildJoin()
		);
  }

  guildJoin() {
	displayToast({ text: `You have sent a join request to ${this.guild.get('name')}. ` }, "success");
	this.guild.fetch();
	this.profile.fetch();
  }

  onWithdrawClicked() {
    this.guild.withdraw(
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.guildWithdraw()
		);
  }

  guildWithdraw() {
	displayToast({ text: `You have withdrawn your request to join ${this.guild.get('name')}. ` }, "success");
	this.guild.fetch();
	this.profile.fetch();
  }

  displayError(error: string) {
    displayToast({ text: error }, "error");
  }


  render() {
    const template = $("#infoTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
	this.$el.html(html);

	const $elementedit = this.$("#edit-btn");
	const $elementquit = this.$("#quit-btn");
	const $elementwar = this.$("#war");
	const $elementjoin = this.$("#join");

	if (this.profile.get("guild")) {
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
	}
	else {
		$elementjoin.show();
	}

	if (this.guild.get('atWar')) {
		$('#war-btn').addClass('btn-war-disabled');
		$('#war-btn').html('This Guild is at war');
	}

	if (this.profile.get('pending_guild')) {
		if (this.profile.get("pending_guild").get('id') === this.guild.get('id')) {
			$('#join-btn').css("font-size", 15 + "px");
			$('#join-btn').html('Withdraw your join request');
			$('#join-btn').attr('id', 'withdraw-btn');
		}
		else {
			$('#join-btn').addClass('btn-join-disabled');
			$('#join-btn').html('You have asked to join another guild');
		}
	}
	
	this.renderNested(this.imgView, "#pageImg");

    return this;
  }
}
