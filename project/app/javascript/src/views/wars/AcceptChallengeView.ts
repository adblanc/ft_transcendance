import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War from "src/models/War";
import WarTime from "src/models/WarTime";
import { displaySuccess, displayError } from "src/utils";
import { currentUser } from "src/models/Profile";
import Game from "src/models/Game";

type Options = Backbone.ViewOptions<War> & {
	warTime: WarTime;
};

export default class AcceptChallengeView extends ModalView<War> {
	warTime: WarTime;
	game: Game;

  constructor(options?: Options) {
	super(options);

	this.warTime = options.warTime;
	this.game = this.warTime.get("pendingGame");
	
  }

  events() {
    return { ...super.events(), "click #accept-challenge-submit": "onSubmit" };
  }

  async onSubmit(e: JQuery.Event) {
	e.preventDefault();
  
	const success = await this.model.acceptChallenge();
	if (success) {
		this.gameSaved();
	}
  }

  gameSaved() {
    this.closeModal();
    displaySuccess("Your have accepted a War Time Challenge...");
	currentUser().fetch();
	this.model.fetch();
	this.model.get("activeWarTime").get("activeGame").navigateToGame();
  }


  render() {
    super.render();
    const template = $("#acceptChallengeTemplate").html();
    const html = Mustache.render(template, this.game.toJSON());
	this.$content.html(html);
	
    return this;
  }
}
