import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Wars from "src/collections/Wars";
import War from "src/models/War";
import ItemPendingView from "./ItemPendingView";

type Options = Backbone.ViewOptions & { collection: Wars };

export default class WarPendingView extends BaseView {
  collection: Wars;

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
      var itemView = new ItemPendingView({
		model: item,
      });
      $element.append(itemView.render().el);
    });

    return this;
  }
}