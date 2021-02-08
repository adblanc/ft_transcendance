import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import { displaySuccess } from "src/utils/toast";
import Game from "src/models/Game";
import { currentUser } from "src/models/Profile";

type Options = Backbone.ViewOptions<Game> & {
  type: string;
};

export default class CreateGameView extends ModalView<Game> {
  type: string;

  constructor(options?: Options) {
    super(options);

    this.type = options.type;
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
      game_type: this.type,
    };

    const success = await this.model.createFriendly(attrs);
    if (success) {
      this.gameSaved();
    }
  }

  gameSaved() {
    this.closeModal();
    displaySuccess("Matching you with another player...");
    currentUser().fetch();
    if (this.model.get("status") === "matched") {
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
