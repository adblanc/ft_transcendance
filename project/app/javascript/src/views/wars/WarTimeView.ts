import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import ActivateView from "./ActivateView";
import ChallengeView from "./ChallengeView";
import War from "src/models/War";
import { displaySuccess, displayError } from "src/utils";

type Options = Backbone.ViewOptions & { war: War};

export default class WarTimeView extends BaseView {
	war: War;

  constructor(options?: Options) {
    super(options);

	this.war = options.war;

	this.listenTo(this.war, "change", this.render);
	
  }

  events() {
    return {
	  "click #wartime-btn": "onActivateClicked",
	  "click #challenge-btn": "onChallengeClicked",
    };
  }

  onActivateClicked() {
	const activateView = new ActivateView({
		model: this.war,
	  });
  
	  activateView.render();
  }

  onChallengeClicked() {
	const challengeView = new ChallengeView({
		model: this.war,
	  });
  
	  challengeView.render();
  }

  render() {
    const template = $("#warTimeTemplate").html();
    const html = Mustache.render(template, this.war.toJSON());
	this.$el.html(html);

	if (this.war.get("atWarTime")) {
		this.$("#active").show();
	}
	else
		this.$("#not-active").show();
	
    return this;
  }
}
