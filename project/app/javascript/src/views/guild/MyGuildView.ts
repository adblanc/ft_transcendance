import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile from "src/models/Profile";

type Options = Backbone.ViewOptions & { model: Backbone.AssociatedModel };

export default class MyGuildView extends BaseView {
  model: Backbone.AssociatedModel;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;

  }

  render() {
	if (this.model.get('guild')) {
		const template = $("#withGuildTemplate").html();
		const html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
	}
	else {
		const template = $("#noGuildTemplate").html();
		const html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
	}

    return this;
  }
}