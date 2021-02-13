import consumer from "channels/consumer";
import Mustache from "mustache";
import Games from "src/collections/Games";
import BaseView from "src/lib/BaseView";
import Game, { IGame } from "src/models/Game";

interface NewGameData {
  event: "new_game";

  game: IGame;
}

interface GameFinishedData {
  event: "finished_game";

  gameId: number;
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
            this.games.push(new Game(data.game));
          } else if (data.event === "finished_game") {
            this.games.remove(data.gameId.toString());
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

    console.log(games);

    const html = Mustache.render(template, {
      games,
      isGamesEmpty: games.length === 0,
    });

    this.$el.html(html);

    return this;
  }
}
