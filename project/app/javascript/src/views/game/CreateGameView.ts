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
	console.log("test");
	this.closeModal();
	displaySuccess("Matching you with another player...");
	
	//this.model.channel = this.createConsumer();
	//redirection page game
}

  render() {
    super.render();
    const template = $("#gameFormTemplate").html();
    const html = Mustache.render(template, {});
    this.$content.html(html);
    return this;
  }
}
