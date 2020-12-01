import Mustache from "mustache";
import BaseView from "src/lib/BaseView";

export default class GameView extends BaseView {
  render() {
    const template = $("#game").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
