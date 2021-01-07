import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
//import Guild from "src/models/Guild";
import Rectangle from "src/models/Rectangle";
import Profile from "src/models/Profile";
import BaseView from "src/lib/BaseView";
import CreateGameView from "./CreateGameView";
import CanvaView from "./CanvaView";
import MainRouter from "src/routers/MainRouter";
import GameView from "./GameView"
import Player from "src/models/Player";
import { displaySuccess } from "src/utils/toast";
import Games from "src/collections/Games";

var canvas = document.createElement("canvas");
var canvaView= new CanvaView({
  model: rectangle,});
var rectangle = new Rectangle(0, 0, 480, 480);

export default class GameIndexView extends BaseView {
  games: Games;
  player_one: Player;
  static i: number = 0;
  jeu: Game;
  jeu_2: Game;
  //var canvaView= new CanvaView();
  constructor(options?) {
    GameIndexView.i++;
    super(options);
    this.jeu = new Game();
    this.jeu_2 = new Game({"id": "28", "level" : "hard", "points" : "2"});
    this.player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
    this.games = new Games({});
    this.games.fetch();
    this.games.add(this.jeu_2);
    
   // var len = this.collection.length;
   
  }
  
  render() {
    displaySuccess(JSON.stringify(this.games));
    const template = $("#index_game").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    return this;
  }

  // canvasClicked(e) {
  //   const scale: number = e.offsetY / 250;
  //   s : String;
  //   var y: Number = 0;
  //   var s = "Mouse down" + String(scale);
  //  canvaView.player_one.paddle.y = canvas.height * scale;
  // if ((y = canvaView.callback(10)) != 0 )
  //   {
  //     this.stop(y);
  //   } 
  // }
  
  events() {
     return {
       "click #create_game": "createGame",
     };
   }

   createGame() {
     this.games.fetch();
  displaySuccess(String(this.games.length));
  //   GameIndexView.i++;
  //   displaySuccess(String(GameIndexView.i));
     const jeu = new Game();
     var gameView = new CreateGameView(this.games.length+2, {model: jeu, collection: this.games});
     gameView.render();
   // var canvas = canvaView.init(500, 250, '#EEE', this.player_one, 3);
   // canvas.addEventListener('click', this.canvasClicked, false);
   // canvas.addEventListener('mousemove', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
   }

   playing()
  {
    const template = $("#playing").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    return this;
  }

  // gameSaved(id: number)
  // {
  //   const router = new MainRouter();
	//   router.navigate(`game/${id}`, { trigger: true });
  // }
  //}
}
