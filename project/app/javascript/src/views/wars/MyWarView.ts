import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import Profile from "src/models/Profile";
import Guild from "src/models/Guild";
import WarPendingView from "./WarPendingView";
import WarConfirmedView from "./WarConfirmedView";
import NoWarView from "./NoWarView";
import WarWaitingView from "./WarWaitingView";

type Options = Backbone.ViewOptions & { guild: Guild, profile: Profile};

export default class MyWarView extends BaseView {
	guild: Guild;
	war: War;
	profile: Profile;
	warPendingView: WarPendingView;
	warConfirmedView: WarConfirmedView;
	warWaitingView: WarWaitingView;
	noWarView: NoWarView;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.profile = options.profile;
	this.warPendingView = undefined;
	this.warConfirmedView = undefined;
	this.warWaitingView = undefined;
	this.noWarView = undefined;

	this.listenTo(this.guild, "change", this.render);
  }

  setundefined(view: string) {
	if (view == "none") {
		this.warPendingView = undefined;
		this.warConfirmedView = undefined;
		this.warWaitingView = undefined;
	}
	else if (view == "pending") {
		this.warConfirmedView = undefined;
		this.warWaitingView = undefined;
		this.noWarView = undefined;
	}
	else if (view == "waiting") {
		this.warPendingView = undefined;
		this.warConfirmedView = undefined;
		this.noWarView = undefined;
	}
	else {
		this.warPendingView = undefined;
		this.warWaitingView = undefined;
		this.noWarView = undefined;
	}
  }

  chooseView() {
	if (!this.guild.get("atWar") && !this.guild.get("pendingWar")) {
		this.noWarView = new NoWarView();
		this.setundefined("none");
	}
	else if (this.guild.get("atWar")) {
		this.warConfirmedView = new WarConfirmedView({
			war: this.guild.get("activeWar"),
			guild: this.guild,
		})
		this.setundefined("confirmed");
	}
	else if (this.guild.get("pendingWar")) {
		if (this.guild.get("warInitiator")) {
			this.warWaitingView = new WarWaitingView({
				war: this.guild.get("waitingWar"),
				guild: this.guild,
			})
			this.setundefined("waiting");
		}
		else {
			this.warPendingView = new WarPendingView({
				collection: this.guild.get("pendingWars"),
				guild: this.guild,
				profile: this.profile,
			})
			this.setundefined("pending");
		}
	}
  }

  render() {
	const template = $("#myWarTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);
	  
	this.chooseView();

	if (this.warPendingView) {
		this.renderNested(this.warPendingView, "#content");
	}
	else if (this.warConfirmedView) {
		console.log("test");
		this.renderNested(this.warConfirmedView, "#content");
	}
	else if (this.warWaitingView) {
		this.renderNested(this.warWaitingView, "#content");
	}
	else if (this.noWarView) {
		this.renderNested(this.noWarView, "#content");
	}

    return this;
  }
}
