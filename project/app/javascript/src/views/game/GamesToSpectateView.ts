import Mustache from "mustache";
import Games from "src/collections/Games";
import BaseView from "src/lib/BaseView";

export default class GamesToSpectateView extends BaseView {
  games: Games;

  constructor() {
    super();

    this.games = new Games();
    this.games.fetchSpectateGames();

    this.listenTo(this.games, "update", this.render);
  }

  render() {
    const template = $("#games-to-spectate-template").html();

    const games = this.games.map((g) => ({
      ...g.toJSON(),
      spectatorsNbr: g.spectatorsNbr,
      firstPlayer: g.get("players").at(0)?.toJSON(),
      secondPlayer: g.get("players").at(1)?.toJSON(),
      link: `/game/${g.get("id")}`,
    }));

    const html = Mustache.render(template, {
      games,
    });

    this.$el.html(html);

    return this;
  }
}
