import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";

export default class LadderView extends BaseView {
  constructor(options?: Backbone.ViewOptions) {
	super(options);

  }

  render() {
    const template = $("#tempTournamentTemplate").html();
    const html = Mustache.render(template, {});
	this.$el.html(html);

    return this;
  }

}
