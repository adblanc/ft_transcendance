import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import Rectangle from "src/models/Rectangle";
import Player from "src/models/Player";
import ModalView from "../ModalView";
import Profile from "src/models/Profile";
import BaseView from "src/lib/BaseView";
import MainRouter from "src/routers/MainRouter";
import { displaySuccess } from "src/utils/toast";
import CanvaView from "./CanvaView";
import Games from "src/collections/Games";
import Profiles from "src/collections/Profiles";

type Options = Backbone.ViewOptions & { game: Game };
var canvaView = new CanvaView({
  model: rectangle,
  });
  var rectangle = new Rectangle(0, 0, 480, 480);
var canvas = document.createElement("canvas");
var points: number = 2;

export default class GameView extends BaseView {
  player_one: Player;
  player_two: Player;
  collection: Games;
    game: Game;
  joueurs: Profiles;
  joueur_un: Profile;
    joueur_deux: Profile;
    constructor(options?: Options) {
        super(options);
        this.game = options.game;
        this.game.fetch({
          error: () => {
            Backbone.history.navigate("/not-found", { trigger: true });
          },
        });
        this.collection = new Games({});
        this.collection.fetch();
         this.joueur_un = new Profile();
         this.joueur_un.fetch();
         this.joueurs = new Profiles();
        // this.joueurs.fetch();
        // this.joueur_un = this.joueurs.get(1);
        // displaySuccess("Joueur 1: " + JSON.stringify(this.joueur_un));
         this.player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
       this.player_two = new Player(new Rectangle(0, canvas.height / 2, 15, 100));
       this.listenTo(this.game, "update", this.render_finished);
      }

      events() {
        return {
          "click #play-game": "play",
        };
      }

      play()
      {
        this.joueurs = this.game.get("user");
        //var player = this.joueurs.findWhere({"name": String(this.joueur_un.get("name"))});
        var j_str = this.joueur_un.get("name") as string;
        var player = this.joueurs.findWhere({"name": j_str})
        displaySuccess("Game players" + JSON.stringify(this.joueurs));
        displaySuccess("User: " + String(this.joueur_un.get("name")));
        displaySuccess("User found" + JSON.stringify(player));
        if (player != undefined)
        {
            displaySuccess("You can play");
        var canvas = canvaView.init(500, 250, '#EEE', this.player_one, this.game.get("points"), this.game.get("level"), this.player_two);
        canvas.addEventListener('click', this.canvasClicked, false);
        canvas.addEventListener('mousemove', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
        }
        else{
          displaySuccess("You watch the game");
        }
      }

      canvasClicked(e) {
        
        const scale: number = e.offsetY / 250;
        s : String;
        var y: Number = 0;
        var s = "Mouse down" + String(scale);
       canvaView.player_two.paddle.y = canvas.height * scale;
       y = canvaView.callback(10);
      if ( y == 2)
        {
          displaySuccess("You won the game" + String(y));
          this.render_won();
        } 
      else if(y == 1)
      {
        displaySuccess("You lost the game" + String(y));
        this.render_lost();
      } 
      }

    render()
    {
    const template = $("#playing").html();
    const html = Mustache.render(template, this.game.toJSON());
    this.$el.html(html);
    return this;
  }

  render_won()
  {
          //    if (this.game.get("user")[1].get("name") == this.joueur_un.get("name"))
          // displaySuccess("Same joueurs");
    displaySuccess("Length is" + JSON.stringify(this.collection.toJSON()));
    const template = $("#game_win").html();
    const html = Mustache.render(template, this.game.toJSON());
    this.$el.html(html);
    return this;
  }
  render_lost()
  {
    // displaySuccess("This game" + JSON.stringify(this.game.get("user").get("name")));
    // displaySuccess("This user name" + this.joueur_un.get("name"));
    this.game.finish();
    const template = $("#game_lost").html();
    const html = Mustache.render(template, this.game.toJSON());
    this.$el.html(html);
    return this;
  }

  render_finished()
  {
    const template = $("#game_finished").html();
    const html = Mustache.render(template, this.game.toJSON());
    this.$el.html(html);
    return this;
  }

}