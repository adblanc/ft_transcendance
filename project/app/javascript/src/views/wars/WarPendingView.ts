import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Wars from "src/collections/Wars";
import GuildWars from "src/collections/GuildWars";
import War from "src/models/War";
import ItemPendingView from "./ItemPendingView";

type Options = Backbone.ViewOptions & { collection: GuildWars };

export default class WarPendingView extends BaseView {
  collection: GuildWars;

  constructor(options?: Options) {
	super(options);
	
	this.collection = options.collection;

    this.listenTo(this.collection, "reset", this.render);
    this.listenTo(this.collection, "change", this.render);
  }

  render() {
    const template = $("#pendingWarsTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	const $element = this.$("#listing-pending");

	console.log(this.collection);

    this.collection.forEach(function (item) {
	  var id = item.get("war_id");
	  var war = new War({id});
      var itemView = new ItemPendingView({
        model: war,
      });
      $element.append(itemView.render().el);
    });

    return this;
  }
}