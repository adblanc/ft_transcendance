import Backbone from "backbone";
import Game from "src/models/Game";
import { BASE_ROOT } from "src/constants";

export default class Games extends Backbone.Collection<Game> {
  constructor() {
    super();
    this.model = Game;
    this.url = `${BASE_ROOT}/games`;
    this.comparator = function (model) {
      return model.get("created_at");
    };
  }

  fetchSpectateGames() {
    return this.fetch({ url: `${this.url}/to_spectate` });
  }
}
