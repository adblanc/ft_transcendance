import Backbone from "backbone";
import axios from "axios";
import { pagesHandler } from "../lib/ViewsHandler";
import IndexView from "../views/IndexView";
import NotifPageView from "../views/NotifPageView";
import GuildView from "../views/guild/GuildView";
import GuildIndexView from "../views/guild/GuildIndexView";
import NotFoundView from "../views/NotFoundView";
import GameView from "../views/game/GameView";
import GameIndexView from "../views/game/GameIndexView";
import { addAuthHeaders } from "../utils";
import AuthView from "../views/AuthView";
import Guild from "src/models/Guild";
import Game from "src/models/Game";

export default class MainRouter extends Backbone.Router {
  constructor() {
    super({
      routes: {
        "": "index",
        auth: "auth",
        "auth/callback?code=:code": "authCallBack",
        game: "game",
        "game/:id": "gameShow",
        guildindex: "guildIndex",
		"guild/:id": "guildShow",
		"me/notifications": "notifShow",
        "*path": "notFound",
      },
    });
  }

  async authCallBack(code: string) {
    try {
      const { data: token } = await axios.get(
        `http://localhost:3000/auth/42?code=${code}`
      );
      addAuthHeaders(token);
    } catch (ex) {
      console.error(ex);
      this.navigate("/auth", { trigger: true });
    }
    this.navigate("/", { trigger: true });
  }

  auth() {
    const authView = new AuthView({});

    pagesHandler.showPage(authView, false, false);
  }

  index() {
    const indexView = new IndexView({
      className: "flex flex-col",
    });

    pagesHandler.showPage(indexView);
  }

  game() {
    const gameIndexView = new GameIndexView({});

    pagesHandler.showPage(gameIndexView);
  }

  notFound() {
    const notFoundView = new NotFoundView({});

    pagesHandler.showPage(notFoundView);
  }

  guildIndex() {
    const guildIndexView = new GuildIndexView();

    pagesHandler.showPage(guildIndexView);
  }

  guildShow(id: string) {
    const guildView = new GuildView({ guild: new Guild({ id }) });
    pagesHandler.showPage(guildView);
  }

  gameShow(id: number) {
    const gameView = new GameView({ game: new Game({ id }) });
    pagesHandler.showPage(gameView);
  }

  notifShow() {
	  const notifPageView = new NotifPageView();
	  pagesHandler.showPage(notifPageView);
  }
}
