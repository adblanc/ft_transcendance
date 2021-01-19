import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import ChallengeView from "./ChallengeView";
import AcceptChallengeView from "./AcceptChallengeView";
import War from "src/models/War";
import WarTime from "src/models/WarTime";
import moment from "moment";
import { displaySuccess, displayError } from "src/utils";
import { currentUser } from "src/models/Profile";

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
	  "click #accept-btn": "onAcceptClicked",
    };
  }

  onChallengeClicked() {
	const challengeView = new ChallengeView({
		model: this.war,
		warTime: this.warTime,
	});
  
	challengeView.render();
  }

  onAcceptClicked() {
	const acceptChallengeView = new AcceptChallengeView({
		model: this.war,
		warTime: this.warTime,
	});
  
	acceptChallengeView.render();
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

	if (this.warTime.get("pendingGame")) {
		if (this.warTime.get("pendingGameInitiator").get("id") == currentUser().get("id"))
			this.$("#wait").show();
		else if (this.warTime.get("pendingGameGuildInitiator").get("id") == currentUser().get("guild").get("id")) 
			this.$("#unavailable").show();
		else
			this.$("#accept").show();
	}
	else if (this.warTime.get("activeGame")) {
		this.$("#in-game").show();
	}
	else { 
		this.$("#challenge").show();
	}
	
    return this;
  }
}
