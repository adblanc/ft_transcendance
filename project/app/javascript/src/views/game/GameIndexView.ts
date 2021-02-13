import Mustache from "mustache";
import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import WaitingGameView from "./WaitingGameView";
import StartGameView from "./StartGameView";
import { currentUser } from "src/models/Profile";
import GamesToSpectateView from "./GamesToSpectateView";

export default class GameIndexView extends BaseView {
  gamesToSpectateView: GamesToSpectateView;
  waitingGameView: WaitingGameView;
  startGameView: StartGameView;

  constructor(options?: Backbone.ViewOptions) {
    super(options);

    this.listenTo(currentUser(), "change", this.renderWaitingGameView);

    this.gamesToSpectateView = new GamesToSpectateView();

    this.waitingGameView = undefined;
    this.startGameView = undefined;
  }

  onClose = () => {
    this.gamesToSpectateView.close();
  };

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
        if (this.waitingGameView) {
          this.waitingGameView.close();
        }
        this.waitingGameView = new WaitingGameView({
          model: currentUser().get("pendingGame"),
          className: "text-center text-white p-5 space-y-5 text-sm",
        });
        this.appendNested(this.waitingGameView, "#game-index-container");
      } else {
        if (this.startGameView) {
          this.startGameView.close();
        }
        this.startGameView = new StartGameView({ disable: true });
        this.appendNested(this.startGameView, "#game-index-container");
      }
    } else {
      if (this.startGameView) {
        this.startGameView.close();
      }
      this.startGameView = new StartGameView({
        disable: !!currentUser().get("tournamentToPlay"),
      });
      this.appendNested(this.startGameView, "#game-index-container");
    }
  }

  renderGamesToSpectate() {
    this.renderNested(this.gamesToSpectateView, "#game-to-spectate");
  }
}
