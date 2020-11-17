import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions & { model: Backbone.Model };

export default class ItemView extends BaseView {
  model: Backbone.Model;
  constructor(options?: Options) {
    super(options);

    this.model = options.model;
  }

  render() {
    const template = $("#itemTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    return this;
  }
}
