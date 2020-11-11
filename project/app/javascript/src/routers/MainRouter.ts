import Backbone from "backbone";
import axios from "axios";
import { viewsHandler } from "../lib/ViewsHandler";
import { RouterOptions } from "../../types/router";
import IndexView from "../views/IndexView";
import NotFoundView from "../views/NotFoundView";
import { addAuthHeaders } from "../utils";
import AuthView from "../views/AuthView";

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

    viewsHandler.showView(authView);
  }

  index() {
    const indexView = new IndexView({
      className: "flex flex-col h-screen",
    });

    viewsHandler.showView(indexView);
  }

  notFound() {
    const notFoundView = new NotFoundView({});

    viewsHandler.showView(notFoundView);
  }

}
