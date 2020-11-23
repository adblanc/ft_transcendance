import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";

type Options = Backbone.ViewOptions & { model: Backbone.AssociatedModel };

export default class MemberView extends BaseView {
  model: Backbone.AssociatedModel;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  render() {
    const template = $("#memberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);

    return this;
  }
}
