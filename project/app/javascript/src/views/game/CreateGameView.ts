import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Game from "src/models/Game";
import Games from "src/collections/Games";
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
  collection: Games;
  player_one: Player;
<<<<<<< HEAD
  player_two: Player;
=======
  player_two: Player
>>>>>>> game
  id: string;
  i: number;
  user: Profile;
  constructor(i: number, options?: Backbone.ViewOptions<Game>) {
    super(options);
    this.i = i;
    this.player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
    this.player_two = new Player(new Rectangle(0, canvas.height / 2, 15, 100));
<<<<<<< HEAD
=======
    this.collection = options.collection;
    this.collection.fetch();
    this.user = new Profile();
    this.user.fetch();
>>>>>>> game
    this.listenTo(this.model, "add", this.render);
  }

  events() {
    return {
      ...super.events(),
      "click #game-enter": "loginGame",
    };
  }
  async loginGame(e: JQuery.Event) {
<<<<<<< HEAD
    //if (e.key === "click") {
      points: Number;
      const points = this.$("#points").val();
    e.preventDefault();
    level: String;
    const level = this.$("#level").val();
    if (!points || !level) {
      return;
    } else {
      jeu: Backbone.Model;
      const enemy = this.$("#input-enemy").val();
      return this.playGame(points, level);
    }
=======
    e.preventDefault();
    var pts =  this.$("#points").val() as number;
    const lvl= this.$("#level").val() as string;
    if (!pts) {
      return;
    } else {
      displaySuccess("first" + String(this.user.get("id")));
      
      const user_id = this.user.get("id") as number;
      displaySuccess("fuser_id" + user_id);
        const attrs = {
          level: this.$("#level").val() as string,
          points: this.$("#points").val() as number,
          id: String(this.i) as string,
          status: "waiting",
          first: user_id,
          user: [],
        };
        
        p_points: Number;
        var p_points = Number(pts);
        
        //this.collection.fetch();
        //const len = this.collection.length;
        var waiting = this.collection.findWhere({status: "waiting", points: p_points, level: lvl});
        if (waiting != undefined)
        {
          var game_id = waiting.get("id");
          var game_exist = this.collection.get(game_id) as Game;
          const success = await game_exist.join();
          game_exist.set("status", "playing");
          if (success) {
            this.gameJoined(String(game_id), game_id);
          }
        }
        else 
        {
          const success = await this.model.createGame(attrs);
          if (success) {
            this.gameSaved();
          }
        }
>>>>>>> game
  }
}
  gameSaved() {
    this.closeModal();
    this.model.fetch();
    displaySuccess("success");
    Backbone.history.navigate(`game/${this.model.get("id")}`, {
      trigger: true,
    });
  }
  gameJoined(s_game_id, game_id) {
    this.closeModal();
    this.model.fetch();
    Backbone.history.navigate(`game/${game_id}`, {
      trigger: true,
    });
  }

  playGame(points, level)
  {
    this.closeModal();
<<<<<<< HEAD
    //var canvaView = new CanvaView();
    //var player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
    var canvas = canvaView.init(500, 250, '#EEE', this.player_one, points, level, this.player_two);
=======
    var canvas = canvaView.init(500, 250, '#AAA', this.player_one, "2", "2", this.player_two, 2);
>>>>>>> game
    canvas.addEventListener('click', this.canvasClicked, false);
    canvas.addEventListener('mousemove', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
  }

  canvasClicked(e) {
    const scale: number = e.offsetY / 250;
    s : String;
    var y: Number = 0;
    var s = "Mouse down" + String(scale);
<<<<<<< HEAD
   canvaView.player_two.paddle.y = canvas.height * scale;
=======
   canvaView.player_one.paddle.y = canvas.height * scale;
>>>>>>> game
  if ((y = canvaView.callback(10)) != 0 )
    {
      displaySuccess("You won the game" + String(y));
      var gameIndex = new GameIndexView({});
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
