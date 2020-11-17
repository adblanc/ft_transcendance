import Backbone from "backbone";
import Mustache from "mustache";
import PageView from "src/lib/PageView";
import BoardView from "./guild/BoardView";

export default class IndexView extends PageView {
  boardView: Backbone.View;
  messages: Backbone.Collection;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.boardView = new BoardView();
  }

  render() {
    const template = $("#indexPageTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.renderNested(this.boardView, "#board");

    return this;
  }
}
