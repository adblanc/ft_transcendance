import Backbone from "backbone";
import Mustache from "mustache";
import Tournament from "src/models/Tournament";
import BaseView from "src/lib/BaseView";

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
    const template = $("#tournamentShowTemplate").html();
    const html = Mustache.render(template, this.tournament.toJSON());
	this.$el.html(html);
	
	//if user is winner, add class winner
	//to display score : add score class - comment je track si un jeu est gagné?

    return this;
  }
}
