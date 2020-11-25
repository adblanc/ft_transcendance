import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile from "src/models/Profile";

export default class MyGuildView extends BaseView {
  model: Backbone.AssociatedModel;

  constructor(options?: Backbone.ViewOptions) {
    super();

	this.model = new Profile();
	this.model.fetch();
  }

  render() {
	if (this.model.get('guild')) {
		console.log('in');
		const template = $("#withGuildTemplate").html();
		const html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
	}
	else {
		console.log('out');
		const template = $("#noGuildTemplate").html();
		const html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
	}

	/*const template = $("#noGuildTemplate").html();
	const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);*/

    return this;
  }
}