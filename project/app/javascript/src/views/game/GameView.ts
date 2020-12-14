import Mustache from "mustache";
import Backbone from "backbone";
import Game from "src/models/Game";
import Profile from "src/models/Profile";
import BaseView from "src/lib/BaseView";
import MainRouter from "src/routers/MainRouter";

type Options = Backbone.ViewOptions & { game: Game };

export default class GameView extends BaseView {
    game: Game;
   // static i: number = 0;
    constructor(options?: Options) {
        super(options);
        this.game = options.game;
        this.game.fetch();
       // this.i++;
      }
    render()
    {
    const template = $("#play").html();
    const html = Mustache.render(template, this.game.toJSON());
    this.$el.html(html);
    //this.renderNested(this, "#play")
    return this;
  }

}