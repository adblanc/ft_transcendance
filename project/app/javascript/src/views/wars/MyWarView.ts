import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import Wars from "src/collections/Wars";
import GuildWars from "src/collections/GuildWars";
import Guild from "src/models/Guild";
import WarPendingView from "./WarPendingView";
import WarConfirmedView from "./WarConfirmedView";
import NoWarView from "./NoWarView";
import WarWaitingView from "./WarWaitingView";

type Options = Backbone.ViewOptions & { guild: Guild};

export default class MyWarView extends BaseView {
	guild: Guild;
	guild_wars: GuildWars;
	war: War;
	warPendingView: WarPendingView;
	warConfirmedView: WarConfirmedView;
	warWaitingView: WarWaitingView;
	noWarView: NoWarView;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.warPendingView = undefined;
	this.warConfirmedView = undefined;
	this.noWarView = undefined;

	this.guild_wars = this.guild.get("guild_wars");
	if (this.guild_wars.isEmpty()) {
		this.noWarView = new NoWarView();
	}

	this.guild_wars.forEach(function (item) {
		if (item.get("status") == "pending") {
			this.warPendingView = new WarPendingView({
				collection: this.guild_wars,
			})
		} else if (item.get("status") == "accepted") {
			  const opponent_id = item.get("opponent_id");
			  const id = item.get("war_id");
			  this.war = new War({id});
			  this.war.fetch({
				success: () => {
					if (this.war.get("status") == "confirmed" || this.war.get("status") == "started") {
						this.warConfirmedView = new WarConfirmedView({
							war: this.war,
							opponent_id: opponent_id,
						})
					} else {
						this.warWaitingView = new WarWaitingView({
							war: this.war,
							opponent_id: opponent_id,
						})
					}
				}
			  });
		} else {
			this.noWarView = new NoWarView();
		}
	}, this);

	this.listenTo(this.war, "all", this.render);
	this.listenTo(this.guild_wars, "update", this.render);
  }

  render() {
	const template = $("#myWarTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);
	  
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
