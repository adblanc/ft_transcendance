import Backbone from "backbone";
import Mustache from "mustache";
import { eventBus } from "src/events/EventBus";
import BaseView from "src/lib/BaseView";
import Pong from "src/lib/Pong";
import Game, { MovementData } from "src/models/Game";
import { currentUser } from "src/models/Profile";

type Options = Backbone.ViewOptions<Game> & {
  gameId: string;
  isTraining?: boolean;
};

export default class GameView extends BaseView<Game> {
  pong: Pong | undefined;
  isTraining: boolean;

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
        this.model.createChannelConsumer();
      },
    });

    this.listenTo(eventBus, "pong:player_movement", this.moveOtherPlayer);
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
    this.pong.players[1].pos.y = data.posY;
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

  render() {
    const template = $("#playGameTemplate").html();
    const html = Mustache.render(template, this.model?.toJSON());
    this.$el.html(html);

    const canvas = this.$("#pong")[0] as HTMLCanvasElement;

    this.pong = new Pong(
      canvas,
      "easy",
      this.isTraining ? "training" : "online"
    );

    return this;
  }
}
