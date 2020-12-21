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
    GameIndexView.i++;
    displaySuccess(String(GameIndexView.i));
     const jeu = new Game();
     var gameView = new CreateGameView(GameIndexView.i, {model: jeu, collection: this.games});
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

//   createGame() {
//   const template = $("#game").html();
//   const html = Mustache.render(template, {});
//   jeu: Backbone.Model;
//   user1: Backbone.Model;
//   //var s1 = new String("<h1>" + jeu.user.getName() + "</h1>");

//   const user1 = new Profile({ name: "Boby", login: "Marshell" });
//   //nom: string;
//   //const var nm: 'Bob';
//   user1.set("name", "Bobard");
//   //user1.sname("Bibou");
//   var jeu = new Game({
//     Id: 0,
//     Type: "normal",
//     Points: 4,
//     Profile: new Profile({ name: "Moby", login: "Marshell" }),
//   });
//   jeu.set("user", user1);
//   jeu.user.set("name", user1.get("name")); // seule chose qui fonctionne pour recup le jeu.user.name. L20 et L21 ne fonctionnent pas alors que le nom est bien set si on fait user1.name. Ccl: il faut set les choses 1 par 1
//   // var s = new String("<h2> Bonjour " + jeu.user.get("name") + "</h2>");
//   // s = s + jeu.gType;
//   // s = s + " </h2>";
//   this.$el.html(html + jeu.get('Id'));

//   // var jeu = new Game(23, 'normal', 4);
//   // console.log(jeu.Type)
//   return this;
// }
// GameView()
//     {
    // jeu: Backbone.Model;
    // const enemy = this.$("#input-enemy").val();
    // points: Number;
    // const points = this.$("#points").val();
    // const level = this.$("#level").val();
    // const one = this.$("#one") as unknown as HTMLInputElement;
    // // if (!one.checked) //ne fonctionne pas
    // //    return this.oups();
    // // else {
    // const template = $("#play").html();
    // var jeu = new Game({
    //   Id: this.i,
    //   Type: level,
    //   Points: points,
    //   Profile: new Profile({ name: "Moby", login: "Marshell" }),
    //   url: 'http://localhost:3000/game/${id}',
    // });
    // this.i++;
    // const html = Mustache.render(template, {});
    // this.$el.html(html  + jeu.get('Id') + jeu.get('Type'));
    // var GameView = new GameView({game: jeu});
    // this.gameSaved(jeu.id);
    // return GameView.render();
    
    //return this;
  // }
  // gameSaved(id: number)
  // {
  //   const router = new MainRouter();
	//   router.navigate(`game/${id}`, { trigger: true });
  // }
  //}
}
