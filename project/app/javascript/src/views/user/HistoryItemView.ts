import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Game from "src/models/Game";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions & { model: Game };

export default class HistoryItemView extends BaseView {
  model: Game;

  constructor(options?: Options) {
    super(options);
	this.model = options.model;
  }

  render() {

	const model = {
		...this.model.toJSON(),
		forfeit: this.model.get("status") === "forfeit",
	}

    const template = $("#historyItem").html();
    const html = Mustache.render(template, model);
    this.$el.html(html);
    return this;
  }
}