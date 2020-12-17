import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import Guild from "src/models/Guild";
import WarPendingView from "./WarPendingView";
import WarConfirmedView from "./WarConfirmedView";
import NoWarView from "./NoWarView";

import { displaySuccess } from "src/utils";

//or maybe pass a guild
type Options = Backbone.ViewOptions & { guild: Guild};

export default class MyWarView extends BaseView {
	guild: Guild;
	warPendingView: WarPendingView;
	warConfirmedView: WarConfirmedView;
	noWarView: NoWarView;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.warPendingView = undefined;
	this.warConfirmedView = undefined;
	this.noWarView = undefined;

	//console.log(this.guild.get("wars"));

	this.guild.get("wars").forEach(function (item) {
		if (item.get("status") == "pending") {
			this.warPendingView = new WarPendingView({
				collection: this.guild.get("wars"),
			})
		} else if (item.get("status") == "confirmed" || item.get("status") == "started") {
			this.warConfirmedView = new WarConfirmedView({
				war: item,
			})
		}
		else {
			this.noWarView = new NoWarView();
		}
	}, this);
  }

  render() {
	const template = $("#myWarTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);
	  
	if (this.warPendingView) {
		this.renderNested(this.warPendingView, "#content");
	}
	else if (this.warConfirmedView) {
		this.renderNested(this.warConfirmedView, "#content");
	}
	else if (this.noWarView) {
		this.renderNested(this.noWarView, "#content");
	}

    return this;
  }
}
