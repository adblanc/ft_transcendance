import Backbone from "backbone";
import axios from "axios";
import { pagesHandler } from "../lib/ViewsHandler";
import IndexView from "../views/IndexView";
import NotifPageView from "../views/NotifPageView";
import GuildView from "../views/guild/GuildView";
import GuildIndexView from "../views/guild/GuildIndexView";
import WarHistoryView from "../views/guild/WarHistoryView";
import NotFoundView from "../views/NotFoundView";
import GameView from "../views/game/GameView";
import GameIndexView from "../views/game/GameIndexView";
import { addAuthHeaders, isAuth } from "../utils";
import AuthView from "../views/AuthView";
import TfaView from "../views/TfaView";
import Guild from "src/models/Guild";
import Game from "src/models/Game";
import UserView from "../views/user/UserView";
import WarIndexView from "../views/wars/WarIndexView";
import { BASE_ROOT } from "src/constants";

const NO_AUTH_ROUTES = ["auth", "authCallBack", "twoFactAuth"];

const shouldBeAuth = (routeName: string) =>
  !NO_AUTH_ROUTES.find((route) => route === routeName);

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
		"guild/:id/wars": "guildWarHistory",
        "me/notifications": "notifShow",
		"user/:id": "userShow",
		"tfa/:user/:tfa": "twoFactAuth",
		warindex: "warIndex",
        "*path": "notFound",
      },
    });
  }

  execute(callback: (...args: any[]) => void, args: any[], name: string) {
    if (shouldBeAuth(name) && !isAuth()) {
      this.navigate("/auth", { trigger: true });
      return false;
    }

    if (callback) {
      callback.apply(this, args);
    }
    return true;
  }

  async authCallBack(code: string) {
    try {
      const { data: rsp } = await axios.get(
        `${BASE_ROOT}/auth/42?code=${code}`
      );
	  if (!rsp.token) {
		this.navigate(`/tfa/${rsp.user}/${rsp.tfa}`, { trigger: true });
		return ;
	  }
      addAuthHeaders(rsp.token);
    } catch (ex) {
      console.error(ex);
      this.navigate("/auth", { trigger: true });
    }
    this.navigate("/", { trigger: true });
  }

  twoFactAuth(user: string, tfa: string) {
    const tfaView = new TfaView({ user: user, tfa: tfa});

    pagesHandler.showPage(tfaView, false, false, false);
  }

  auth() {
    const authView = new AuthView({});

    pagesHandler.showPage(authView, false, false, false);
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

  guildWarHistory(id: string) {
    const warHistoryView = new WarHistoryView({ guild: new Guild({ id }) });
    pagesHandler.showPage(warHistoryView);
  }

  gameShow(id: number) {
    const gameView = new GameView({ game: new Game({ id }) });
    pagesHandler.showPage(gameView);
  }

  notifShow() {
    const notifPageView = new NotifPageView();
    pagesHandler.showPage(notifPageView);
  }

  userShow(id: number) {
    const userView = new UserView({ userId: id });
    pagesHandler.showPage(userView);
  }

  warIndex() {
    if (!isAuth()) {
      return this.navigate("/auth", { trigger: true });
    }
    const warIndexView = new WarIndexView();
    pagesHandler.showPage(warIndexView);
  }

}
