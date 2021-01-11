import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War from "src/models/War";
import { displaySuccess, displayError } from "src/utils";

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
	
    console.log("do something");
  }


  render() {
    super.render();
    const template = $("#challengeTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);
	
    return this;
  }
}
