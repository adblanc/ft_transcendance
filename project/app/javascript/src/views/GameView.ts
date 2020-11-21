import Mustache from "mustache";
import PageView from "src/lib/PageView";

export default class GameView extends PageView {
    render() {
      const template = $("#game").html();
      const html = Mustache.render(template, {});
      this.$el.html(html);
  
      return this;
    }
  }