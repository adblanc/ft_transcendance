import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War from "src/models/War";
import { displaySuccess, displayError } from "src/utils";
import { currentUser } from "src/models/Profile";

export default class ChallengeView extends ModalView<War> {

  constructor(options?: Backbone.ViewOptions<War>) {
    super(options);

    this.listenTo(this.model, "change", this.render);
  }

  events() {
    return { ...super.events(), "click #input-challenge-submit": "onSubmit" };
  }

  async onSubmit(e: JQuery.Event) {
	e.preventDefault();

	var level = this.$("#level").val() as string;
	var goal = this.$("#goal").val() as number;
	var game_type = "war_time";
  
	const success = await this.model.challenge(
		level,
		goal,
		game_type,
	);
	if (success) {
		this.gameSaved();
	}
  }

  gameSaved() {
    this.closeModal();
    displaySuccess("Your challenge has been sent to the opponent guild...");
	currentUser().fetch();
    this.model.fetch();
  }


  render() {
    super.render();
    const template = $("#challengeTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);

	if (this.model.get("max_unanswered_calls"))
		this.$("#max-calls").show();
	
    return this;
  }
}
