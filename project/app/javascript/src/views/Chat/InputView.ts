import Mustache from "mustache";
import BaseView from "../../lib/BaseView";

export default class InputView extends BaseView {
  render() {
    const template = $("#chatInputTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
