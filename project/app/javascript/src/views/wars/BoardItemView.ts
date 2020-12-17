import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";

type Options = Backbone.ViewOptions & { model: War };

export default class BoardItemView extends BaseView {
  model: War;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;

  }

  render() {
    const template = $("#itemWarTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);
	

    return this;
  }
}