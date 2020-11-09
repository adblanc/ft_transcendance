import Mustache from "mustache";
import BaseView from "./BaseView";

export default class NotFoundView extends BaseView {
  render() {
    const template = $("#notFoundTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
