import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import Profile from "src/models/Profile";
import BaseView from "src/lib/BaseView";
import CreateGameView from "./CreateGameView";
import MainRouter from "src/routers/MainRouter";
import GameView from "./GameView"


export default class GameIndexView extends BaseView {
  static i: number = 1;
  constructor(options?) {
    super(options);
   // GameIndexView.i++;
  }
  render() {
    const template = $("#index_game").html();
    const html = Mustache.render(template, {});
    // jeu: Backbone.Model;
    // user1: Backbone.Model;
    //var s1 = new String("<h1>" + jeu.user.getName() + "</h1>");
    // const user1 = new Profile({ name: "Boby", login: "Marshell" });
    // //nom: string;
    // //const var nm: 'Bob';
    // user1.set("name", "Bobard");
    // //user1.sname("Bibou");
    // var jeu = new Game({
    //   Id: 23,
    //   Type: "normal",
    //   Points: 4,
    //   Profile: new Profile({ name: "Moby", login: "Marshell" }),
    // });
    // jeu.set("user", user1);
    // jeu.user.set("name", user1.get("name")); // seule chose qui fonctionne pour recup le jeu.user.name. L20 et L21 ne fonctionnent pas alors que le nom est bien set si on fait user1.name. Ccl: il faut set les choses 1 par 1
    // var s = new String("<h2> Bonjour " + jeu.user.get("name") + "</h2>");
    // s = s + jeu.gType;
    // s = s + " </h2>";
    this.$el.html(html);

    // var jeu = new Game(23, 'normal', 4);
    // console.log(jeu.Type)
    return this;
  }
   events() {
     return {
  //     "click #game-enter": "loginGame",
      "click #create_game": "onCreateGame",
     };
   }
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
