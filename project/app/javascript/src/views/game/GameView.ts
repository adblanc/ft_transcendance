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
  isTraining: boolean;
  spectatorsView: SpectatorsView;

  constructor(options: Options) {
    super(options);

    this.pong = undefined;
    this.model = undefined;

    if (options.isTraining) {
      this.isTraining = true;
      return;
    } else {
      this.isTraining = false;
    }

    this.model = new Game({ id: parseInt(options.gameId) });

    this.model.fetch({
      error: this.onFetchError,
      success: () => {
        console.log("game model fetch success");
        this.model.createChannelConsumer();
      },
    });

    this.spectatorsView = new SpectatorsView({
      spectators: this.model.get("spectators"),
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
        .get("users")
        .findIndex((u) => u.get("id") === data.playerId);
    }

    this.pong.players[index].pos.y = data.posY;
  }

  onMouseMove(e: JQuery.MouseMoveEvent) {
    if (this.pong && !this.model?.get("isSpectator")) {
      const scale = e.offsetY / e.target.getBoundingClientRect().height;

      this.pong.players[0].pos.y = this.pong.canvas.height * scale;

      if (!this.isTraining) {
        this.model.channel?.perform("player_movement", {
          playerId: currentUser().get("id"),
          posY: this.pong.players[0].pos.y,
        });
      }
    }
  }

  onClick(e: JQuery.ClickEvent) {
    if (this.pong && !this.model?.get("isSpectator")) {
      this.pong.start();
    }
  }

  renderSpectators() {
    this.renderNested(this.spectatorsView, "#spectators");
  }

  render() {
    const template = $("#playGameTemplate").html();

    console.log("render gameview");

    const html = Mustache.render(template, {
      ...this.model?.toJSON(),
      isTraining: this.isTraining,
      firstPlayerName: this.model?.get("users")?.first()?.get("name"),
      secondPlayerName: this.model?.get("users")?.last()?.get("name"),
    });
    this.$el.html(html);

    this.renderSpectators();

    const canvas = this.$("#pong")[0] as HTMLCanvasElement;

    this.pong = new Pong(
      canvas,
      "easy",
      this.isTraining ? "training" : "online"
    );

    return this;
  }
}
