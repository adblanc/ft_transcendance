import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import PageImgView from "./imgsViews/PageImgView";
import Profile from "src/models/Profile";
import Guild from "src/models/Guild";
import ModifyGuildView from "./ModifyGuildView";
import { displayError, displayErrors, displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { guild: Guild; profile: Profile };

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

  async onQuitClicked() {
    try {
      await this.guild.quit();
      this.guildQuit();
    } catch (err) {
      displayErrors(err);
    }
  }

  guildQuit() {
    displaySuccess(`You successfully left ${this.guild.get("name")}.`);
    this.guild.fetch();
    this.profile.fetch();
    if (this.guild.get("members").length == 0) {
      displaySuccess(
        `You were the only member of ${this.guild.get(
          "name"
        )}, so the guild was destroyed.`
      );
      return Backbone.history.navigate("/", { trigger: true });
    } else if (this.profile.get("guild_role") == "Owner") {
      displaySuccess(
        `Your owner privileges were transferred to ${this.guild.get(
          "name"
        )}'s oldest member.`
      );
    }
  }

  onJoinClicked() {
    this.guild.join(
      (errors) => {
        errors.forEach((error) => {
          displayError(error);
        });
      },
      () => this.guildJoin()
    );
  }

  guildJoin() {
    displaySuccess(
      `You have sent a join request to ${this.guild.get("name")}. `
    );
    this.guild.fetch();
    this.profile.fetch();
  }

  onWithdrawClicked() {
    this.guild.withdraw(
      (errors) => {
        errors.forEach((error) => {
          displayError(error);
        });
      },
      () => this.guildWithdraw()
    );
  }

  guildWithdraw() {
    displaySuccess(
      `You have withdrawn your request to join ${this.guild.get("name")}. `
    );
    this.guild.fetch();
    this.profile.fetch();
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
      if (
        this.profile.get("guild").get("id") === this.guild.get("id") &&
        this.profile.get("guild_role") === "Owner"
      ) {
        $elementedit.show();
      }
      if (this.profile.get("guild").get("id") === this.guild.get("id")) {
        $elementquit.show();
      } else {
        $elementwar.show();
      }
    } else {
      $elementjoin.show();
    }

    if (this.guild.get("atWar")) {
      $("#war-btn").addClass("btn-war-disabled");
      $("#war-btn").html("This Guild is at war");
    }

    if (this.profile.get("pending_guild")) {
      if (
        this.profile.get("pending_guild").get("id") === this.guild.get("id")
      ) {
        $("#join-btn").css("font-size", 15 + "px");
        $("#join-btn").html("Withdraw your join request");
        $("#join-btn").attr("id", "withdraw-btn");
      } else {
        $("#join-btn").addClass("btn-join-disabled");
        $("#join-btn").html("You have asked to join another guild");
      }
    }

    this.renderNested(this.imgView, "#pageImg");

    return this;
  }
}
