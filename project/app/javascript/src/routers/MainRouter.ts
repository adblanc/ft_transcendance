import Backbone from "backbone";
import axios from "axios";
import { viewsHandler } from "../lib/ViewsHandler";
import { RouterOptions } from "../../types/router";
import IndexView from "../views/IndexView";
import GuildView from "../views/guild/GuildView";
import GuildIndexView from "../views/guild/GuildIndexView";
import NotFoundView from "../views/NotFoundView";
import { addAuthHeaders } from "../utils";
import AuthView from "../views/AuthView";
import Guild from "src/models/Guild";

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
    viewsHandler.removeNavbar();
    const authView = new AuthView({});

    viewsHandler.showView(authView);
  }

  index() {
    if (!viewsHandler.isNavbarDislayed()) {
      viewsHandler.addNavbar();
    }
    const indexView = new IndexView({
      className: "flex flex-col h-screen",
    });

    viewsHandler.showView(indexView);
  }

  notFound() {
    const notFoundView = new NotFoundView({});

    viewsHandler.showView(notFoundView);
  }

  guildIndex() {
    const guildIndexView = new GuildIndexView();

    viewsHandler.showView(guildIndexView);
  }

  guildShow(id: string) {
    const guildView = new GuildView({ guild: new Guild({ id }) });

    viewsHandler.showView(guildView);
  }
}
