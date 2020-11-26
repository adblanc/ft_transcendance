import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile from "src/models/Profile"

type Options = Backbone.ViewOptions & { model: Profile };

export default class MemberView extends BaseView {
  model: Profile;

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
