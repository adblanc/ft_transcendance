import Backbone from "backbone";
import Mustache from "mustache";
import Game from "src/models/Game";
import BaseView from "src/lib/BaseView";
import { displaySuccess } from "src/utils";
import { currentUser } from "src/models/Profile";

type Options = Backbone.ViewOptions & {
  model: Game;
  round: string;
  nb: number;
};

export default class MatchView extends BaseView {
  model: Game;
  round: string;
  nb: number;

  constructor(options?: Options) {
    super(options);

    this.model = options.model;
    this.round = options.round;
    this.nb = options.nb;

    const button = document.querySelector(
      `#round-${this.round}-game-${this.nb}`
    );
    button.addEventListener("click", (event) => {
      this.onPlayClicked(event);
    });
  }

  async onPlayClicked(e: Event) {
    e.preventDefault();
    if ($(`#round-${this.round}-game-${this.nb}`).hasClass("play")) {
      const success = await this.model.startTournamentGame();
      if (success) {
        this.start();
      }
    }
  }

  start() {
    currentUser().fetch();
    if (this.model.get("status") === "matched") {
      console.log("status matched on navigate to game");
      this.model.navigateToGame();
      displaySuccess("Redirecting you to the game...");
    } else {
      console.log("on cree channel consumer on met pending game");
      displaySuccess("Waiting for opponent to start the game...");
      this.model.createChannelConsumer();
      Backbone.history.navigate("/play", {
        trigger: true,
      });
    }
  }

  render() {
    const game = {
      ...this.model.toJSON(),
      finished:
        this.model.get("status") === "finished" ||
        this.model.get("status") === "forfeit",
    };

    const template = $(`#matchTemplate`).html();
    const html = Mustache.render(template, game);
    this.$el.html(html);

    if (this.model.get("status") === "pending") {
      this.model.get("players").forEach(function (item) {
        if (currentUser().get("id") == item.get("id")) {
          $(`#round-${this.round}-game-${this.nb}`).addClass("play");
          $(`#game-to-play`).show();
        }
      }, this);
    }

    return this;
  }
}
