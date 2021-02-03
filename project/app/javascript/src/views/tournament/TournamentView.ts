import Backbone from "backbone";
import Mustache from "mustache";
import Tournament from "src/models/Tournament";
import BaseView from "src/lib/BaseView";
import moment from "moment";

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
	
	//if user is winner, add class winner
	//to display score : add score class - comment je track si un jeu est gagné?

    return this;
  }
}
