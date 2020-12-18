import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import Rectangle from "src/models/Rectangle";
import Player from "src/models/Player";
import Profile from "src/models/Profile";
import BaseView from "src/lib/BaseView";
import MainRouter from "src/routers/MainRouter";
import { displaySuccess } from "src/utils/toast";
import CanvaView from "./CanvaView";

type Options = Backbone.ViewOptions & { game: Game };
var canvaView = new CanvaView({
  model: rectangle,
  });
  var rectangle = new Rectangle(0, 0, 480, 480);
var canvas = document.createElement("canvas");
var level: number = 2;
var points: number = 2;

export default class GameView extends BaseView {
  player_one: Player;
  player_two: Player;
    game: Game;
   // static i: number = 0;
    constructor(options?: Options) {
        super(options);
        this.game = options.game;
        this.game.fetch({
          error: () => {
            Backbone.history.navigate("/not-found", { trigger: true });
          },
        });
         this.player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
       this.player_two = new Player(new Rectangle(0, canvas.height / 2, 15, 100));
         //var canvas = canvaView.init(500, 250, '#EEE', this.player_one, points, level, this.player_two);
       //  canvas.addEventListener('click', this.canvasClicked, false);
      //   canvas.addEventListener('mousemove', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
      //   this.render();
      }
      // canvasClicked(e) {
      //   const scale: number = e.offsetY / 250;
      //   s : String;
      //   var y: Number = 0;
      //   var s = "Mouse down" + String(scale);
      //  canvaView.player_two.paddle.y = canvas.height * scale;
      // if ((y = canvaView.callback(10)) != 0 )
      //   {
      //     displaySuccess("You won the game" + String(y));
      //   } 
      // }
    render()
    {
    const template = $("#playing").html();
    const html = Mustache.render(template, this.game.toJSON());
    this.$el.html(html);
    return this;
  }

}