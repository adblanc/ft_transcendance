import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import Game from "src/models/Game";

export default class StartGameView extends BaseView<Game> {
  constructor(options?: Backbone.ViewOptions<Game>) {
	super(options);
  }

  render() {
	const template = $("#waitingOpponentTemplate").html();
	if (this.model.get("war_time")) {
		const html = Mustache.render(template, {
			time: this.model.get("war_time").get("time_to_answer")
		});
		this.$el.html(html);
		this.$("#war-time").show();
	}
	else {
		const html = Mustache.render(template, {});
		this.$el.html(html);
		this.$("#classic").show();
	}

    return this;
  }

}