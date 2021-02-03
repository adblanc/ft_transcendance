import Backbone from "backbone";
import Mustache from "mustache";
import Tournament from "src/models/Tournament";
import BaseView from "src/lib/BaseView";
import moment from "moment";
import { displaySuccess } from "src/utils";
import { currentUser } from "src/models/Profile";
import RoundView from "./RoundView";

type Options = Backbone.ViewOptions & { tournament: Tournament };

export default class TournamentView extends BaseView {
  tournament: Tournament;

  constructor(options?: Options) {
    super(options);

    this.tournament = options.tournament;

    this.tournament.fetch({
      error: () => {
        Backbone.history.navigate("/not-found", { trigger: true });
      },
	});
	
    this.listenTo(this.tournament, "change", this.render);
  }

  events() {
    return {
      "click #register-btn": "onRegisterClicked",
    };
  }

  async onRegisterClicked() {
    const success = await this.tournament.register();
    if (success) {
      this.registered();
    }
  }

  registered() {
    displaySuccess(
      `You have registered to the ${this.tournament.get("name")} tournament. `
    );
    this.tournament.fetch();
    currentUser().fetch();
  }

  render() {

	const tour = {
		...this.tournament.toJSON(),
		registration_start: moment(this.tournament.get("registration_start")).format(
			"MMM Do YY, h:mm a"
		),
		registration_end: moment(this.tournament.get("registration_end")).format(
		  "MMM Do YY, h:mm a"
		),
	};

    const template = $("#tournamentShowTemplate").html();
    const html = Mustache.render(template, tour);
	this.$el.html(html);
	

	var roundOneView = new RoundView({
		collection: this.tournament.get("round_one_games"),
		round: "One",
	});
	this.renderNested(roundOneView, "#round1");
	var roundTwoView = new RoundView({
		collection: this.tournament.get("round_two_games"),
		round: "Two",
	});
	this.renderNested(roundTwoView, "#round2");
	var roundThreeView = new RoundView({
		collection: this.tournament.get("round_three_games"),
		round: "Three",
	});
	this.renderNested(roundThreeView, "#round3");

    return this;
  }
}