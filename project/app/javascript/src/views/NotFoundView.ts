import Mustache from "mustache";
import PageView from "src/lib/PageView";

export default class NotFoundView extends PageView {
  render() {
    const template = $("#notFoundTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
