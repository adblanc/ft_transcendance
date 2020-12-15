import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import BaseView from "src/lib/BaseView";

export default class WarIndexView extends BaseView {

  constructor(options?: Backbone.ViewOptions) {
    super(options);

  }

  render() {
    const template = $("#warIndexTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
