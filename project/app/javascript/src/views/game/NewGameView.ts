import Backbone from "backbone";
import BaseView from "src/lib/BaseView";
import Game from "src/models/Game";

type Options = Backbone.ViewOptions<Game> & {
  gameId: string;
};

export default class NewGameView extends BaseView<Game> {
  constructor(options: Options) {
    super(options);

    this.model = new Game({ id: parseInt(options.gameId) });

    this.model.fetch({ error: this.onFetchError });
  }

  onFetchError() {
    Backbone.history.navigate("/not-found", { trigger: true });
  }
}
