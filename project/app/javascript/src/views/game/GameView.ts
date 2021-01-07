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
import ActionCable from 'actioncable';
import Mouvement from "src/models/Mouvement";
import Mouvements from "src/collections/Mouvements";

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
    inter: any = null;
    g_points: number;
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
      //   this.mouvements = new Mouvements();
        // this.mouvements.fetch();
        // this.joueurs.fetch();
        // this.joueur_un = this.joueurs.get(1);
        // displaySuccess("You won the game" + JSON.stringify(this.game));
        // if (this.game.status == "finished")
        // {
        //   displaySuccess("finished");
        //   this.render_finished();
        // }
        // else {
         this.player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
       this.player_two = new Player(new Rectangle(0, canvas.height / 2, 15, 100));
       //this.listenTo(this.game, "change:second", this.render_finished);
       this.listenTo(this.game.mouvements, "add", this.canva_render);
       this.listenTo(this.game, "change:status", this.render_playing);
       //this.listenTo(this.game.model, "change", this.play);
       //var inter = setTimeout(this.keyBoardClicked,100);
      //  }
      }

      events() {
        return {
          "click #play-game": "play",
        };
      }

      game_draw(game, joueur_un)
      {
              var y: Number = 0;
        if ((y = canvaView.callback(10)) == 2)
        {
          if (game.get("first") == joueur_un.get("id"))
          { this.g_points = canvaView.player_one.score;
            displaySuccess("this joueur" + String(this.g_points));
          }
          else
          {
            this.g_points = canvaView.player_two.score;
            displaySuccess("this joueur" + String(this.g_points));
          }
          canvaView.stop();
          game.finish(this.g_points);
            displaySuccess("You won the game ok");
            window.location.reload();
          //this.render_lost();
        } 
      else if((y = canvaView.callback(10)) == 1)
      {
        //supprimer le canva
        //arreter le streaming
        canvaView.stop();
        displaySuccess("You lost the game" + JSON.stringify(game));
        if (game.get("first") == joueur_un.get("id"))
        { this.g_points = canvaView.player_one.score;
        }
        else
        {
          this.g_points = canvaView.player_two.score;
        }
        game.finish(this.g_points);
        window.location.reload();
        //this.render_lost();
      } 
      else
      {
      }
      }

      play()
      {
        //this.listenTo(this.game, "change:status", this.render_finished);
        var inter_game = setInterval(this.game_draw,100, this.game, this.joueur_un); //arreter au bout d'un moment
        //displaySuccess("length of users" + String(this.game.user.length))
        //var inter_fetch = setInterval(this.game.asyncFetch, 100);
        this.listenTo(this.game.model, "change", this.canva_render);
       // this.game.on("change:status", function(inter) {displaySuccess("STOPPING"); clearInterval(inter);});
        this.joueurs = this.game.get("user");
        //var player = this.joueurs.findWhere({"name": String(this.joueur_un.get("name"))});
        var j_str = this.joueur_un.get("name") as string;
        var player = this.joueurs.findWhere({"name": j_str})
        if (player != undefined)
        {
            displaySuccess("You can play");
        var canvas = canvaView.init(500, 250, '#EEE', this.player_one, this.game.get("points"), this.game.get("level"), this.player_two);
        //console.log("received JSON Play" + String(this.game.model.get("scale")));
       // this.listenTo(this.game.mouvements, "add", this.canva_render);
        canvas.addEventListener('click', this.canvasClicked, false);
        //canvas.addEventListener('mousemove', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
       // window.addEventListener('keydown', event => { const e = event as KeyboardEvent; this.keyBoardClicked(-1);}, false);
        window.addEventListener('keydown', event => { const e = event as KeyboardEvent; this.keyBoardClicked(e);}, false);
        //canvas.addEventListener('keydown',  this.keyBoardClicked());  
      }
        else{
          displaySuccess("You watch the game");
          var canvas = canvaView.init(500, 250, '#EEE', this.player_one, this.game.get("points"), this.game.get("level"), this.player_two);
        }
      }

      canva_render()
      {
        //displaySuccess("first" + String(this.game.get("first")));
        console.log("received JSON render" + JSON.stringify(this.game.model.get("scale")));
        if ((this.game.model.get("sent") && this.game.get("first") == this.joueur_un.get("id")) || (!this.game.model.get("sent") && this.game.get("first") != this.joueur_un.get("id")) && this.game.model.get("scale") > 0)
        {canvaView.player_one.paddle.y += 10;
          displaySuccess("me up");
          if (canvaView.player_one.paddle.y >= canvas.height)
          {
            canvaView.player_one.paddle.y = canvas.height
          }
        }
        else if ((!this.game.model.get("sent") && this.game.get("first") == this.joueur_un.get("id")) || (this.game.model.get("sent") && this.game.get("first") != this.joueur_un.get("id")) && this.game.model.get("scale") > 0)
        {
          displaySuccess("them up");
          canvaView.player_two.paddle.y += 10;
          if (canvaView.player_two.paddle.y >= canvas.height)
          {
            canvaView.player_two.paddle.y = canvas.height
          }
        }
        else if ((this.game.model.get("sent") && this.game.get("first") == this.joueur_un.get("id")) || (!this.game.model.get("sent") && this.game.get("first") != this.joueur_un.get("id")) && this.game.model.get("scale") < 0)
        {
          displaySuccess("me down");
          canvaView.player_one.paddle.y -= 10;
          if (canvaView.player_one.paddle.y <= 0)
          {
            canvaView.player_one.paddle.y = 0;
          }
        }
        else if ((!this.game.model.get("sent") && this.game.get("first") == this.joueur_un.get("id")) || (this.game.model.get("sent") && this.game.get("first") != this.joueur_un.get("id")) && this.game.model.get("scale") < 0)
        {
          displaySuccess("them down");
          canvaView.player_two.paddle.y -= 10;
          if (canvaView.player_two.paddle.y <= 0)
          {
            canvaView.player_two.paddle.y = 0;
          }
        }
         var y: Number = 0;
      //  // y = canvaView.callback(10);
      //    if ( (y = canvaView.callback(10)) == 2)
      //    {
      //     displaySuccess("You won the game" + JSON.stringify(this.game));
      //      this.game.finish();
      //      displaySuccess("You won the game ok" + JSON.stringify(this.game));
      //      this.render_won();
      //    } 
      //  else if((y = canvaView.callback(10)) == 1)
      //  {
      //    displaySuccess("You lost the game" + String(y));
      //    this.render_lost();
      //  } 
      }

      keyBoardClicked(e) {
        var scale = 0;
        if (String(e.key) == "ArrowDown")
        {
          scale = Math.random() * 1;
        }
        else if (String(e.key) == "ArrowUp")
        {
          scale = Math.random() * -1;
        }
        else
        {
          return;
        }
        //const scale: number = e.offsetY / 250;
        s : String;
        //var s = "Mouse down" + String(scale);
        var g_id = this.game.get("id") as number;
        var j_id = Number(this.joueur_un.get("id"));
        var s_g_id = String("game_" + this.game.get("id"));
        //ActionCable.server.broadcast(s_g_id, scale);
        const mouvement = new Mouvement({
          scale: scale,
          game_id: g_id,
          user_id: j_id,
        });
        const success = mouvement.save();
       // displaySuccess("here key down" + JSON.stringify(e));
      }
      
      canvasClicked(e) {
        //setTimeout(this.canvasClicked,1000);
        const scale: number = e.offsetY / 250;
        s : String;
        var s = "Mouse down" + String(scale);
        var g_id = this.game.get("id") as number;
        var j_id = Number(this.joueur_un.get("id"));
        var s_g_id = String("game_" + this.game.get("id"));
        //ActionCable.server.broadcast(s_g_id, scale);
        const mouvement = new Mouvement({
          scale: scale,
          game_id: g_id,
          user_id: j_id,
        });
        const success = mouvement.save();
      }
      

    render()
    {
      displaySuccess(JSON.stringify(this.game));
      this.inter = setInterval(this.page_reload, 1000);
      const template = $("#waiting").html();
      const html = Mustache.render(template, this.game.toJSON());
      this.$el.html(html);
      return this;
  }

  page_reload()
  {
    window.location.reload();
    displaySuccess("reloading");
  }

  render_won()
  {
    //clearInterval();
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
   //this.game.finish();
   displaySuccess("RENDER LOST");
    const template = $("#game_lost").html();
    const html = Mustache.render(template, this.game.toJSON());
    this.$el.html(html);
    return this;
  }

  // render_finished()
  // {
  //   displaySuccess("UPDATE");
  //   const template = $("#game_finished").html();
  //   const html = Mustache.render(template, this.game.toJSON());
  //   this.$el.html(html);
  //   return this;
  // }
  render_playing()
  {
    clearInterval(this.inter);
    displaySuccess(JSON.stringify(this.game));
    displaySuccess(this.game.get("status"));
    if (this.game.get("status") == "finished")
    {
      displaySuccess("here finish");
      const template = $("#game_finished").html();
      const html = Mustache.render(template, this.game.toJSON());
      this.$el.html(html);
      return this;
    }
    else if (this.game.get("status") == "playing")
    {
      const template = $("#playing").html();
      const html = Mustache.render(template, this.game.toJSON());
      this.$el.html(html);
      return this;
    }
    //this.listenTo(this.game, "change:status", this.render_finished); // fonctionne pas

  }

}