import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import Pong from "src/lib/Pong";
import Game from "src/models/Game";

type Options = Backbone.ViewOptions<Game> & {
  gameId: string;
};

export default class GameView extends BaseView<Game> {
  pong: Pong | undefined;

  constructor(options: Options) {
    super(options);

    this.model = new Game({ id: parseInt(options.gameId) });

    this.model.fetch({ error: this.onFetchError });

    this.pong = undefined;
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

  onMouseMove(e: JQuery.MouseMoveEvent) {
    if (this.pong) {
      const scale = e.offsetY / e.target.getBoundingClientRect().height;

      this.pong.players[0].pos.y = this.pong.canvas.height * scale;
    }
  }

  onClick(e: JQuery.ClickEvent) {
    if (this.pong) {
      this.pong.start();
    }
  }

  render() {
    const template = $("#playGameTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    const canvas = this.$("#pong")[0] as HTMLCanvasElement;

    this.pong = new Pong(canvas);

    return this;
  }
}
