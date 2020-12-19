import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Game from "src/models/Game";
import { displaySuccess } from "src/utils/toast";
import Profile from "src/models/Profile";
import { generateAcn } from "src/utils/acronym";
import { BASE_ROOT } from "src/constants";
import CanvaView from "./CanvaView";
import Player from "src/models/Player"
import Rectangle from "src/models/Rectangle"
import GameIndexView from "./GameIndexView";

var canvaView = new CanvaView({
  model: rectangle,
  });
  var rectangle = new Rectangle(0, 0, 480, 480);
var canvas = document.createElement("canvas");

export default class CreateGameView extends ModalView<Game> {
  player_one: Player;
  player_two: Player
  id: string;
  i: number;
  
  constructor(i: number, options?: Backbone.ViewOptions<Game>) {
    super(options);
    this.i = i;
    this.player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
    this.player_two = new Player(new Rectangle(0, canvas.height / 2, 15, 100));
    this.listenTo(this.model, "add", this.render);
  }

  events() {
    return {
      ...super.events(),
      "click #game-enter": "loginGame",
    };
  }
  async loginGame(e: JQuery.Event) {
    e.preventDefault();
    const points =  this.$("#points").val() as number;
    if (!points) {
      return;
    } else {
        const attrs = {
          level: this.$("#level").val() as string,
          points: this.$("#points").val() as number,
          id: String(this.i) as string,
          status: "waiting",
          user: [],
        };
        const success = await this.model.createGame(attrs);
        if (success) {
          this.gameSaved();
        }
  }
}
  gameSaved() {
    this.closeModal();
    this.model.fetch();
    Backbone.history.navigate(`games/${this.model.get("id")}`, {
      trigger: true,
    });
    //Backbone.history.navigate(`game/${this.id}`, { trigger: true });
  }

  playGame(points)
  {
    this.closeModal();
    //var canvaView = new CanvaView();
    //var player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
    var canvas = canvaView.init(500, 250, '#EEE', this.player_one, "2", "2", this.player_two);
    canvas.addEventListener('click', this.canvasClicked, false);
    canvas.addEventListener('mousemove', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
  }

  canvasClicked(e) {
    const scale: number = e.offsetY / 250;
    s : String;
    var y: Number = 0;
    var s = "Mouse down" + String(scale);
   canvaView.player_one.paddle.y = canvas.height * scale;
  if ((y = canvaView.callback(10)) != 0 )
    {
      displaySuccess("You won the game" + String(y));
      var gameIndex = new GameIndexView({});
      // const template = $("#game_win").html();
      // const html = Mustache.render(template, {});
      // this.$el.html(html);
      // document.querySelector('#computer-score').textContent = String(y);
      // return this;
    } 
  }

  render() {
    super.render(); // we render the modal
    const template = $("#gameFormTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
