import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../../lib/BaseView";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions & { model: Guild };

export default class PageImgView extends BaseView {
  model: Guild;

  constructor(options?: Options) {
    super(options);

    this.model = options.model;
  }

  render() {
    if (this.model.get("img_url")) {
      const template = $("#pageImgExists").html();
      const html = Mustache.render(template, this.model.toJSON());
      this.$el.html(html);
    } else {
      const template = $("#noPageImg").html();
      const html = Mustache.render(template, this.model.toJSON());
      this.$el.html(html);
    }

    return this;
  }
}
