import Mustache from "mustache";
import BaseView from "src/lib/BaseView";

export default class GameFinishedView extends BaseView {
  render() {
    const template = $("#game_finished").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    return this;
  }
}