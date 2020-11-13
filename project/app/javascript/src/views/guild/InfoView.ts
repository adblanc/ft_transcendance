import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../BaseView";
import Guild from "src/models/Guild";

export default class InfoView extends Backbone.View<Guild> {
	
	constructor(options?: Backbone.ViewOptions<Guild>) {
		super(options);
	
		this.listenTo(this.model, "change", this.render);
	  }


  render() {
    const template = $("#infoTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
} 
