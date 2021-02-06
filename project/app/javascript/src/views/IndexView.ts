import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import IndexBoardView from "./guild/IndexBoardView";
import IndexLadderView from "./tournament/IndexLadderView";

export default class IndexView extends BaseView {
  indexBoardView: Backbone.View;
  indexLadderView: Backbone.View;
  messages: Backbone.Collection;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

	this.indexBoardView = new IndexBoardView();
	this.indexLadderView = new IndexLadderView();
  }

  render() {
    const template = $("#indexPageTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

	this.renderNested(this.indexBoardView, "#guild-board");
	this.renderNested(this.indexLadderView, "#ladder-board");

    return this;
  }
}
