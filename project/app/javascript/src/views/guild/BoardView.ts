import Backbone from "backbone";
//import Backbone, { CollectionFetchOptions } from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "../BaseView";
import Guild from "src/models/Guild";
import Guilds from "src/collections/Guilds";
import ItemView from "./ItemView";

export default class BoardView extends BaseView {
  collection: Backbone.Collection<Guild>;
  itemView: Backbone.View;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

	this.collection = new Guilds({});
	this.listenTo(this.collection, 'reset', this.render);
	this.listenTo(this.collection, "change", this.render);
	this.listenTo(this.collection, "sort", this.render);
	this.collection.fetch();
	this.collection.sort();

  }

  render() {
	const template = $("#boardTemplate").html();
	const html = Mustache.render(template, {});
	this.$el.html(html);

	const $element = this.$("#listing");

	//console.log(this.collection.length);

    this.collection.slice(0, 5).forEach(function(item) {
		//console.log(item);
		var itemView = new ItemView({
		  model: item
		});
		$element.append(itemView.render().el);
	});


    return this;
  }
}