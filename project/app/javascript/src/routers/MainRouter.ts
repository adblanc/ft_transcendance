import Backbone from "backbone";
import axios from "axios";
import { pagesHandler } from "../lib/ViewsHandler";
import { RouterOptions } from "../../types/router";
import IndexView from "../views/IndexView";
import GuildView from "../views/guild/GuildView";
import GuildIndexView from "../views/guild/GuildIndexView";
import NotFoundView from "../views/NotFoundView";
import GameView from "../views/GameView";
import { addAuthHeaders } from "../utils";
import AuthView from "../views/AuthView";
import Guild from "src/models/Guild";
import ChatView from "../views/Chat/ChatView";

export default class MainRouter extends Backbone.Router {
  constructor(options: RouterOptions<MainRouter>) {
    super(options);
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

    pagesHandler.showPage(authView, false);
  }

  index() {
    const indexView = new IndexView({
      className: "flex flex-col h-screen",
    });

    pagesHandler.showPage(indexView);
  }

  game() {
    const gameView = new GameView({});

    pagesHandler.showPage(gameView);
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

  chat() {
    const chatView = new ChatView();

    pagesHandler.showPage(chatView);
  }
}
