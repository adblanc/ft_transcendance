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

var canvas = document.createElement("canvas");
var rectangle = new Rectangle(0, 0, 480, 480);
var canvaView = new CanvaView({
  model: rectangle,
  });
  var mouse = new MouseEvent('mousedown');
//var player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));

export default class GameIndexView extends BaseView {
  player_one: Player;
  static i: number = 1;
  jeu: Game;
  constructor(options?) {
    super(options);
    this.jeu = new Game();
    this.player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
    this.listenTo(this.player_one, "add", this.render);
  }


  
  render() {
    const template = $("#index_game").html();
    const html = Mustache.render(template, {'score': +this.player_one.score});
    this.$el.html(html);
   // this.init(500, 250, '#AAA');
   
    var canvas = canvaView.init(500, 250, '#EEE', this.player_one);
    var evtarget = new EventTarget();
    mouse.initMouseEvent('mousemove', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, evtarget);
     canvas.addEventListener('click', this.canvasClicked, false);
     canvas.addEventListener('mousemove', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
     //canvas.addEventListener('mouseover', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
    
    //evtarget.addEventListener('mousedown', this.canvasClicked, false)
    

    //$('#index_game').append(canvaView.render().el);
    return this;
  }
  canvasClicked(e) {
    const scale: number = e.offsetY / 250;
    s : String;
    var s = "Mouse down" + String(scale);
    
    // canvas.getBoundingClientRect().height;
   canvaView.player.paddle.y = canvas.height * scale;
    canvaView.update(100);
    }
  
  events() {
     return {
  //     "click #game-enter": "loginGame",
      //"click #create_game": "move",
     // 'mouseout': "move",
      //'mouseleave': "move",
     // "click #canvas": "move",
     };
   }

  //  init(width, height, bg) {
  //   canvas.width = width;
  //   canvas.height = height;
  //   canvas.style.backgroundColor = bg;
  //   document.body.appendChild(canvas);
  // }
//   async loginGame(e: JQuery.Event)
//   {
//     //if (e.key === "click") {
//     const input = this.$("#points").val();
//       e.preventDefault();
//       if (!input) {
//         return;
//       }
//       else {
//         return this.GameView();
//       }
//   //}
// }

  onCreateGame() {
    const game = new Game();
    const createGameView = new CreateGameView(GameIndexView.i, {
	  model: game,
    collection: this.collection,
    });
    GameIndexView.i++;
    createGameView.render();
  }

  move() {
   canvaView.update(10);
   canvaView.callback(new Date().getSeconds());
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
  oups()
  {
    const oups = $("#oups").html();
    const html = Mustache.render(oups, {});
    this.$el.html(html);
    return this;
  }
}
