import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import { displaySuccess } from "src/utils/toast";
import Game from "src/models/Game";
import { currentUser } from "src/models/Profile";

export default class CreateGameView extends ModalView<Game> {
  constructor(options?: Backbone.ViewOptions<Game>) {
    super(options);
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
    displaySuccess("Matching you with another player...");

    if (this.model.get("status") === "started") {
      this.model.navigateToGame();
    } else {
      this.model.createChannelConsumer();
    }
  }

  render() {
    super.render();
    const template = $("#gameFormTemplate").html();
    const html = Mustache.render(template, {});
    this.$content.html(html);
    return this;
  }
}
