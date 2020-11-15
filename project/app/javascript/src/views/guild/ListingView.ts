import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../BaseView";
import Guild from "src/models/Guild";
import ItemView from "./ItemView";

type Options = Backbone.ViewOptions & {collection: Backbone.Collection<Guild>};

export default class ListingView extends BaseView {
	collection: Backbone.Collection<Guild>;
	constructor(options?: Options) {
		super(options);
	
		this.collection = options.collection;
	  }


  render() {
    const template = $("#listing").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	console.log(this.collection.length);

    this.collection.forEach(function(item) {
		console.log(item);
		this.itemView = new ItemView({
		  model: item
		});
		this.appendNested(this.itemView, "#listing");
	});

    return this;
  }
} 