import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import ItemImgView from "./imgsViews/ItemImgView";

type Options = Backbone.ViewOptions & { model: Backbone.AssociatedModel };

export default class ItemView extends BaseView {
  model: Backbone.AssociatedModel;
  imgView: Backbone.View;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
	this.imgView = new ItemImgView({
		model: this.model,
	});
  }

  render() {
    const template = $("#itemTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);
	
	this.renderNested(this.imgView, "#itemImg");

    return this;
  }
}
