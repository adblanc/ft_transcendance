import Mustache from "mustache";
import Games from "src/collections/Games";
import BaseView from "src/lib/BaseView";

export default class GamesToSpectateView extends BaseView {
  games: Games;

  constructor() {
    super();

    this.games = new Games();
    this.games.fetchSpectateGames();
  }

  render() {
    const template = $("#games-to-spectate-template").html();

    const html = Mustache.render(template, this.games.toJSON());

    this.$el.html(html);

    return this;
  }
}
