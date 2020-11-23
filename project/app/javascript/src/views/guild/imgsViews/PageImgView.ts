import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../../lib/BaseView";

type Options = Backbone.ViewOptions & { model: Backbone.AssociatedModel };

export default class PageImgView extends BaseView {
  model: Backbone.AssociatedModel;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  render() {
	if (this.model.get('img_url')) {
		const template = $("#pageImgExists").html();
		const html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
	}
	else {
		const template = $("#noPageImg").html();
		const html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
	}

    return this;
  }
}