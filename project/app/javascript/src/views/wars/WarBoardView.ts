import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Wars from "src/collections/Wars";
import War from "src/models/War";
import WarItemView from "./WarItemView";

type Options = Backbone.ViewOptions & { collection: Wars };

export default class WarBoardView extends BaseView {
  collection: Wars;
  itemView: Backbone.View;
  max: number;
  count: number;

  constructor(options?: Options) {
	super(options);
	
	this.max = 5;

	this.collection = options.collection;

    this.listenTo(this.collection, "reset", this.render);
    this.listenTo(this.collection, "change", this.render);
    this.listenTo(this.collection, "sort", this.render);
  }

  renderWar(war: War) {
	var itemWarView = new WarItemView({
		model: war,
	  });
	  this.$("#listing").append(itemWarView.render().el);
  }

  onLoadMore() {
	  var wars = this.collection.models.slice(this.count, this.count + this.max);
	  if(wars.length) {
			wars.forEach(function (item) {
				this.renderWar(item);
			}, this);
		  	this.count += wars.length;
	  } 
	  if (this.count == this.collection.length) {
		  this.$("#load-more").hide();
	  }
  }

  render() {
    const template = $("#warBoardTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	var wars = this.collection.first(this.max);
	wars.forEach(function (item) {
		this.renderWar(item);
	}, this);
	this.count = wars.length;
	if (this.count == this.collection.length) {
		this.$("#load-more").hide();
	}


    return this;
  }
}