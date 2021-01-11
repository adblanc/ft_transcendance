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
   model: rectangle,});
  var rectangle = new Rectangle(0, 0, 480, 480);
var points: number = 2;

export default class GameView extends BaseView {
  canvaView: CanvaView;
  player_one: Player;
  player_two: Player;
  collection: Games;
    game: Game;
  joueurs: Profiles;
  joueur_un: Profile;
    joueur_deux: Profile;
    inter: any = null;
    g_points: number;
    canvas: HTMLCanvasElement;
    ctx: RenderingContext;
    constructor(options?: Options) {
        super(options);
    this.canvaView = canvaView;
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
         this.player_one = new Player(new Rectangle(485, 250 / 2 - 50, 15, 100));
       this.player_two = new Player(new Rectangle(0, 250 / 2 - 50, 15, 100));
       this.listenTo(this.game.mouvements, "add", this.canva_render_scale);
       this.listenTo(this.game, "change:status", this.render_playing);
      }

      events() {
        return {
          "click #play-game": "play",};
      }

      game_draw(game, joueur_un)
      {
          canvaView.callback(1000);
          canvaView.ball.update(); // ça beug > may be a cause de pas 'this'
          var g_id = game.get("id") as number;
          const mouvement = new Mouvement({
          ball_x: canvaView.ball.x,
          ball_y: canvaView.ball.y,
          game_id: g_id,
          });
          const success = mouvement.save();
      }

      play()
      {
        this.listenTo(this.game.model, "change:scale", this.canva_render_scale);
        this.listenTo(this.game.model, "change:score_one", this.change_score_one);
        this.listenTo(this.game.model, "change:score_two", this.change_score_two);
        this.listenTo(this.game.model, "change:ball_x", this.canva_render_ball);
        this.joueurs = this.game.get("user");
        var j_str = this.joueur_un.get("name") as string;
        var player = this.joueurs.findWhere({"name": j_str})
        this.canvas = canvaView.init('#AAA', this.player_one, this.game.get("points"), this.game.get("level"), this.player_two, this.game.get("id"));
        //var canvas = canvaView.init(this.canvas.height, this.canvas.width, '#EEE', this.player_one, this.game.get("points"), this.game.get("level"), this.player_two);
        //canvas.addEventListener('mousemove', event => { const e = event as MouseEvent; this.canvasClicked(e);}, false);
       // window.addEventListener('keydown', event => { const e = event as KeyboardEvent; this.keyBoardClicked(-1);}, false);
       if (player != undefined)
        {
          displaySuccess("You can play");
          window.addEventListener('keydown', event => { const e = event as KeyboardEvent; this.keyBoardClicked(e);}, false);
          if (this.game.get("first") != this.joueur_un.get("id"))
          {
            var inter_game = setInterval(this.game_draw,150, this.game, this.joueur_un); //arreter au bout d'un moment
          }
        }
      }

      canva_render_ball()
      {
        canvaView.ball.x = this.game.model.get("ball_x");
        canvaView.ball.y = this.game.model.get("ball_y");
        canvaView.draw();
      }

      canva_render_scale()
      {
        if ((this.game.model.get("user_id") == this.joueur_un.get("id") && this.game.get("first") == this.joueur_un.get("id")) || (this.game.model.get("user_id") != this.joueur_un.get("id") && this.game.get("first") != this.joueur_un.get("id")))
        {
          if (Number(this.game.model.get("scale")) < 0)
          {
            canvaView.player_one.paddle.y += 10;
            if (canvaView.player_one.paddle.y >= 250 - (250 / 2 - 50))
            {
              canvaView.player_one.paddle.y = 250 - (250 / 2 - 50);
            }
          }
          else{
            canvaView.player_one.paddle.y -= 10;
            if (canvaView.player_one.paddle.y <= 0)
            {
              canvaView.player_one.paddle.y = 0;
            }
          }
        }
        else if ((this.game.model.get("user_id") != this.joueur_un.get("id") && this.game.get("first") == this.joueur_un.get("id")) || (this.game.model.get("user_id") == this.joueur_un.get("id") && this.game.get("first") != this.joueur_un.get("id")))
        {
          if (Number(this.game.model.get("scale")) < 0)
          {
            canvaView.player_two.paddle.y += 10;
            if (canvaView.player_two.paddle.y >= 250 - (250 / 2 - 50))
            {
              canvaView.player_two.paddle.y = 250 - (250 / 2 - 50);
            }
          }
          else{
            canvaView.player_two.paddle.y -= 10;
            if (canvaView.player_two.paddle.y <= 0)
            {
              canvaView.player_two.paddle.y = 0;
            }
          }
        }
      canvaView.draw();
      }

      change_score_one()
      {
        document.querySelector('#computer-score').textContent = String(this.game.model.get("score_one"));
        if (this.game.model.get("score_one") >= this.game.get("points"))
        {
          if (this.game.get("first") == this.joueur_un.get("id"))
            { 
              this.g_points = canvaView.player_one.score;
            }
            else
            {
              this.g_points = canvaView.player_two.score;
            }
            canvaView.stop();
            this.game.finish(this.g_points);
            window.location.reload();
      }
    }

      change_score_two()
      {
        document.querySelector('#player-score').textContent = String(this.game.model.get("score_two"));
        if (this.game.model.get("score_two") >= this.game.get("points"))
        {
        if (this.game.get("first") == this.joueur_un.get("id"))
          
          { 
            displaySuccess("You lost");
            this.g_points = canvaView.player_one.score;
          }
          else
          {
            this.g_points = canvaView.player_two.score;
          }
          canvaView.stop();
          this.game.finish(this.g_points);
          window.location.reload();
        }
      }

      keyBoardClicked(e) {
        var scale = 0;
        if (String(e.key) == "ArrowDown")
        {
          scale = Math.random() * -1;
        }
        else if (String(e.key) == "ArrowUp")
        {
          scale = Math.random() * 1;
        }
        else
        { return;}
        s : String;
        var g_id = Number(this.game.get("id"));
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
      //displaySuccess("this canvas" + String(this.canvas.id));
      this.inter = setInterval(this.page_reload, 1000);
      const template = $("#waiting").html();
      const html = Mustache.render(template, this.game.toJSON());
      this.$el.html(html);
      return this;
  }

  page_reload()
  {
    window.location.reload();
  }

  render_won()
  {
    displaySuccess("Length is" + JSON.stringify(this.collection.toJSON()));
    const template = $("#game_win").html();
    const html = Mustache.render(template, this.game.toJSON());
    this.$el.html(html);
    return this;
  }
  render_lost()
  {
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
    if (this.game.get("status") == "finished")
    {
      const template = $("#game_finished").html();
      const html = Mustache.render(template, this.game.toJSON());
      this.$el.html(html);
      return this;
    }
    else if (this.game.get("status") == "playing")
    {
      var el_playing = document.getElementById("playing");
      const template = $("#playing").html();
      const html = Mustache.render(template, this.game.toJSON());
      this.$el.html(html);
      this.renderNested(canvaView, "#canvas_yes");
      return this;
    }

  }
        // canvasClicked(e) {
      //   //setTimeout(this.canvasClicked,1000);
      //   const scale: number = e.offsetY / 250;
      // }

}