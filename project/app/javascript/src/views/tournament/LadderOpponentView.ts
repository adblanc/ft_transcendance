import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile, { currentUser } from "src/models/Profile";
import { displaySuccess } from "src/utils/toast";
import Game from "src/models/Game";
import User from "src/models/User";
import { eventBus } from "src/events/EventBus";

type Options = Backbone.ViewOptions & { model: User; challengeable: boolean };

export default class LadderOpponentView extends BaseView {
  model: User;
  game: Game;
  challengeable: boolean;
  justLost: boolean;

  constructor(options?: Options) {
    super(options);

    this.model = options.model;
    this.challengeable = options.challengeable;
    if (currentUser().get("pendingGame") || currentUser().get("matchedGame") || currentUser().get("currentGame")) this.challengeable = false;
    if (this.model.get("id") == currentUser().get("ladder_unchallengeable")) {
      this.challengeable = false;
      this.justLost = true;
    }

    this.listenTo(currentUser(), "change", this.render);
  }

  events() {
    return {
      "click #challenge-ladder": "onChallenge",
    };
  }

  async onChallenge(e: JQuery.Event) {
    e.preventDefault();
    this.game = new Game();
    const success = await this.game.ladderChallenge(this.model.get("id"));
    if (success) {
      this.gameSaved();
    }
  }

  gameSaved() {
    displaySuccess(`Waiting for ${this.model.get("login")}`);
    currentUser().fetch();
    this.game.createChannelConsumer();
  }

  render() {
    const template = $("#ladderOpponentTemplate").html();
    const html = Mustache.render(template, {
      ...this.model.toJSON(),
      challengeable: this.challengeable,
      justlost: this.justLost,
    });
    this.$el.html(html);

    return this;
  }
}
