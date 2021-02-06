import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import User from "src/models/User";

type Options = Backbone.ViewOptions & { model: User};

export default class IndewLadderItemView extends BaseView {
  model: User;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }


  render() {
    const template = $("#indexLadderItemTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}
