import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import BoardView from "./guild/BoardView";

export default class IndexView extends BaseView {
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
