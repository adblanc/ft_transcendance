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
import { addAuthHeaders, isAuth } from "../utils";
import AuthView from "../views/AuthView";
import Guild from "src/models/Guild";
import Game from "src/models/Game";
import UserView from "../views/user/UserView";

export default class MainRouter extends Backbone.Router {
  constructor() {
    super({
      routes: {
        "": "index",
        auth: "auth",
        "auth/callback?code=:code": "authCallBack",
        games: "game",
        "games/:id": "gameShow",
        guildindex: "guildIndex",
        "guild/:id": "guildShow",
        "me/notifications": "notifShow",
		"user/:id": "userShow",
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

    pagesHandler.showPage(authView, false, false, false);
  }

  index() {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
    const indexView = new IndexView({
      className: "flex flex-col",
    });

    pagesHandler.showPage(indexView);
  }

  game() {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
    const gameIndexView = new GameIndexView({});

    pagesHandler.showPage(gameIndexView);
  }

  notFound() {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
    const notFoundView = new NotFoundView({});

    pagesHandler.showPage(notFoundView);
  }

  guildIndex() {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
    const guildIndexView = new GuildIndexView();

    pagesHandler.showPage(guildIndexView);
  }

  guildShow(id: string) {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
    const guildView = new GuildView({ guild: new Guild({ id }) });
    pagesHandler.showPage(guildView);
  }

  gameShow(id: number) {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
    const gameView = new GameView({ game: new Game({ id }) });
    pagesHandler.showPage(gameView);
  }

  notifShow() {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
    const notifPageView = new NotifPageView();
    pagesHandler.showPage(notifPageView);
  }

  userShow(id: number) {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
	const userView = new UserView({ userId: id });
	pagesHandler.showPage(userView);
  }
}
