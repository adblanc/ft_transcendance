import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War from "src/models/War";
import WarTime from "src/models/WarTime";
import { displaySuccess, displayError } from "src/utils";
import { currentUser } from "src/models/Profile";
import Game from "src/models/Game";

export default class AcceptChallengeView extends ModalView<Game> {

  constructor(options?: Backbone.ViewOptions<Game>) {
	super(options);
	
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
	this.model.navigateToGame();
  }


  render() {
    super.render();
    const template = $("#acceptChallengeTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);
	
    return this;
  }
}
