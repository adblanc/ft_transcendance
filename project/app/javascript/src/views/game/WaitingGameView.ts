import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";

export default class StartGameView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
	super(options);
  }

  render() {
    const template = $("#waitingOpponentTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    return this;
  }

}