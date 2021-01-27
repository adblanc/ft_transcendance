import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import Pong from "src/lib/Pong";
import Game, { MovementData } from "src/models/Game";
import { currentUser } from "src/models/Profile";
import SpectatorsView from "./SpectatorsView";

type Options = Backbone.ViewOptions<Game> & {
  gameId: string;
  isTraining?: boolean;
};

export default class GameView extends BaseView<Game> {
  pong: Pong | undefined;
  spectatorsView: SpectatorsView;

  constructor(options: Options) {
    super(options);

    this.pong = undefined;
    this.model = new Game({
      id: parseInt(options.gameId),
      isTraining: options.isTraining,
    });
    this.spectatorsView = undefined;

    if (options.isTraining) {
      return;
    }

    this.spectatorsView = new SpectatorsView({
      spectators: this.model.get("spectators"),
    });

    this.model.fetch({
      error: this.onFetchError,
      success: () => {
        console.log("game model fetch success");
        this.model.connectToWS();
      },
    });

    this.listenTo(eventBus, "pong:player_movement", this.moveOtherPlayer);
    this.listenTo(this.model, "change", this.render);
  }

  events() {
    return {
      "mousemove #pong": this.onMouseMove,
      "click #pong": this.onClick,
    };
  }

  onFetchError() {
    Backbone.history.navigate("/not-found", { trigger: true });
  }

  moveOtherPlayer(data: MovementData) {
    let index = 1;

    if (this.model.get("isSpectator")) {
      index = this.model
        .get("players")
        .findIndex((u) => u.get("id") === data.playerId);
    }

    this.model.get("players").at(index).posY = data.posY;
  }

  onMouseMove(e: JQuery.MouseMoveEvent) {
    if (this.pong && !this.model?.get("isSpectator")) {
      const scale = e.offsetY / e.target.getBoundingClientRect().height;

      this.model.get("players").at(0).posY = this.pong.canvas.height * scale;

      if (!this.model.get("isTraining")) {
        this.model.channel?.perform("player_movement", {
          playerId: currentUser().get("id"),
          posY: this.model.get("players").at(0).posY,
        });
      }
    }
  }

  onClick(e: JQuery.ClickEvent) {
    if (this.pong && this.model.get("isHost")) {
      this.pong.start();
    }
  }

  renderSpectators() {
    if (this.spectatorsView) {
      this.renderNested(this.spectatorsView, "#spectators");
    }
  }

  render() {
    if (!this.model.get("isTraining") && !this.model.get("status")) {
      return;
    }

    const template = $("#playGameTemplate").html();

    const html = Mustache.render(template, {
      ...this.model?.toJSON(),
      isTraining: this.model.get("isTraining"),
      firstPlayerName: this.model.get("players")?.first()?.get("name"),
      secondPlayerName: this.model.get("players")?.last()?.get("name"),
    });
    this.$el.html(html);

    this.renderSpectators();

    const canvas = this.$("#pong")[0] as HTMLCanvasElement;

    this.pong = new Pong(canvas, this.model);

    return this;
  }
}
