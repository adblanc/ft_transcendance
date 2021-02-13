import consumer from "channels/consumer";
import Mustache from "mustache";
import Games from "src/collections/Games";
import BaseView from "src/lib/BaseView";
import Game, { IGame } from "src/models/Game";

interface NewGameData {
  event: "new_game";

  payload: IGame;
}

interface GameFinishedData {
  event: "finished_game";

  payload: {
    gameId: number;
  };
}

type GameToSpectateData = NewGameData | GameFinishedData;

export default class GamesToSpectateView extends BaseView {
  games: Games;
  channel: ActionCable.Channel;

  constructor() {
    super();

    this.games = new Games();
    this.games.fetchSpectateGames();

    this.listenTo(this.games, "update", this.render);
    this.channel = this.createGamesToSpectateChannel();
  }

  onClose = () => {
    this.channel.unsubscribe();
  };

  createGamesToSpectateChannel() {
    return consumer.subscriptions.create(
      { channel: "GamesToSpectateChannel" },
      {
        connected: () => {
          console.log("connected to games to spectate channel");
        },
        received: (data: GameToSpectateData) => {
          if (data.event === "new_game") {
            console.log("we push new game", data);
            this.games.push(new Game(data.payload));
          }
        },
        disconnected: () => {
          console.log("disconnected from spectate channel");
        },
      }
    );
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
