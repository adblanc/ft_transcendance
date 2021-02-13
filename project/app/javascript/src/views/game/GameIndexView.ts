import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import WaitingGameView from "./WaitingGameView";
import StartGameView from "./StartGameView";
import { currentUser } from "src/models/Profile";
import GamesToSpectateView from "./GamesToSpectateView";

export default class GameIndexView extends BaseView {
  gamesToSpectateView: GamesToSpectateView;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.listenTo(currentUser(), "change", this.render);

    this.gamesToSpectateView = new GamesToSpectateView();
  }

  render() {
    const template = $("#gameIndexTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    this.renderWaitingGameView();

    this.renderGamesToSpectate();

    return this;
  }

  renderWaitingGameView() {
    if (currentUser().get("matchedGame")) {
      Backbone.history.navigate(`/game/${currentUser().get("matchedGame")}`, {
        trigger: true,
      });
    } else if (currentUser().get("pendingGame")) {
      if (currentUser().get("pendingGame").get("game_type") != "chat") {
        const waitingGameView = new WaitingGameView({
          model: currentUser().get("pendingGame"),
          className: "text-center text-white p-5 space-y-5 text-sm",
        });
        this.renderNested(waitingGameView, "#game-index-container");
      } else {
        const startGameView = new StartGameView({ disable: true });
        this.renderNested(startGameView, "#game-index-container");
      }
    } else if (currentUser().get("tournamentToPlay")) {
      const startGameView = new StartGameView({ disable: true });
      this.renderNested(startGameView, "#game-index-container");
    } else {
      const startGameView = new StartGameView({ disable: false });
      this.renderNested(startGameView, "#game-index-container");
    }
  }

  renderGamesToSpectate() {
    this.renderNested(this.gamesToSpectateView, "#game-to-spectate");
  }
}
