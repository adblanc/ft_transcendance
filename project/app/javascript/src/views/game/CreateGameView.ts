import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import { displaySuccess } from "src/utils/toast";
import Game from "src/models/Game";
import { currentUser } from "src/models/Profile";

export default class CreateGameView extends ModalView<Game> {

  constructor(options?: Backbone.ViewOptions<Game>) {
    super(options);
    /*this.player_one = new Player(new Rectangle(485, canvas.height / 2 - 25, 15, 100));
    this.player_two = new Player(new Rectangle(0, canvas.height / 2, 15, 100));
    this.listenTo(this.model, "add", this.render);*/
  }

  events() {
    return {
      ...super.events(),
      "click #input-game-submit": "onSubmit",
    };
  }

  async onSubmit(e: JQuery.Event) {
    e.preventDefault();
        const attrs = {
          level: this.$("#level").val() as string,
          goal: this.$("#goal").val() as number,
        };
        
        const success = await this.model.createGame(attrs);
        if (success) {
            this.gameSaved();
        }
  	}

  gameSaved() {
    this.closeModal();
    this.model.fetch();
    displaySuccess("Matching you with another player...");
}

  /*playGame(points, level)
  {
    this.closeModal();
    var canvas = canvaView.init('#AAA', this.player_one, "2", "2", this.player_two, 2);
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
    } 
  }*/

  render() {
    super.render();
    const template = $("#gameFormTemplate").html();
    const html = Mustache.render(template, {});
    this.$content.html(html);
    return this;
  }
}
