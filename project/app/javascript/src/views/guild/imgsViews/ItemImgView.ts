import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../../lib/BaseView";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions & { model: Guild };

export default class ItemImgView extends BaseView {
  model: Guild;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  render() {
	if (this.model.get('img_url')) {
		const template = $("#itemImgExists").html();
		const html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
	}
	else {
		const template = $("#itemNoImg").html();
		const html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
	}

    return this;
  }
}