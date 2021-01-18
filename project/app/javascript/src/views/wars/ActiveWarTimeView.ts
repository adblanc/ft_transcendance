import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import ChallengeView from "./ChallengeView";
import War from "src/models/War";
import WarTime from "src/models/WarTime";
import moment from "moment";
import { displaySuccess, displayError } from "src/utils";

type Options = Backbone.ViewOptions & { war: War};

export default class ActiveWarTimeView extends BaseView {
	war: War;
	warTime: WarTime;

  constructor(options?: Options) {
    super(options);

	this.war = options.war;
	this.warTime = this.war.get("activeWarTime");

	this.listenTo(this.war, "change", this.render);
	this.listenTo(this.warTime, "change", this.render);
	
  }

  events() {
    return {
	  "click #challenge-btn": "onChallengeClicked",
    };
  }

  onChallengeClicked() {
	const challengeView = new ChallengeView({
		model: this.war,
	  });
  
	  challengeView.render();
  }

  render() {
	const warTime = {
		...this.warTime.toJSON(),
		end: moment(this.war.get("end")).format(
		  "MMM Do YY, h:mm a"
		),
	};

    const template = $("#activeWarTimeTemplate").html();
    const html = Mustache.render(template, warTime);
	this.$el.html(html);
	
    return this;
  }
}
