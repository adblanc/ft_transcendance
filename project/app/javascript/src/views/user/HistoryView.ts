import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Game from "src/models/Game";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { model: Game };

export default class HistoryView extends BaseView {
  model: Game;

  constructor(options?: Options) {
    super(options);
	this.model = options.model;
  }

  render() {
    const template = $("#history").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);
    return this;
  }
}