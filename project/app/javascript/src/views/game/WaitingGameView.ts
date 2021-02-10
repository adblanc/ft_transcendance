import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import Game from "src/models/Game";

export default class StartGameView extends BaseView<Game> {
  constructor(options?: Backbone.ViewOptions<Game>) {
    super(options);
  }

  events() {
    return {
      "click #cancel-friendly": this.onCancelFriendly,
    };
  }

  onCancelFriendly() {
    this.model.cancelFriendly();
  }

  render() {
    const template = $("#waitingOpponentTemplate").html();

    const isWar = this.model.get("game_type") === "war_time";
    const isLadder = this.model.get("game_type") === "ladder";
    const isClassic = !isWar && !isLadder;

    const html = Mustache.render(template, {
      time: this.model.get("war_time")?.get("time_to_answer"),
      isWar,
      isLadder,
      isClassic,
    });
    this.$el.html(html);

    return this;
  }
}
