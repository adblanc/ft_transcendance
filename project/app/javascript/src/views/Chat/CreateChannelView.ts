import Mustache from "mustache";
import BaseView from "../BaseView";

export default class CreateChannelView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
    super({ className: "flex-1", ...options });
  }
  render() {
    const template = $("#createChannelTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
