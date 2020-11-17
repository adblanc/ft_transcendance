import Backbone from "backbone";
import { name } from "mustache";
import MainRouter from "./routers/MainRouter";
import { addAuthHeaders, catchNavigation } from "./utils";
import NavbarView from "./views/NavbarView";

export function start() {
  if (process.env.NODE_ENV === "development") {
    const token = localStorage.getItem("tokenAuth") || "";
    addAuthHeaders(token);
  }

  const mainRouter = new MainRouter({
    routes: {
      "": "index",
      auth: "auth",
      "auth/callback?code=:code": "authCallBack",
      guildindex: "guildIndex",
      "guild/:id": "guildShow",
      "*path": "notFound",
    },
  });

  $.ajaxSetup({
    statusCode: {
      401: () => {
        mainRouter.navigate("auth", { trigger: true });
      },
      403: () => {
        mainRouter.navigate("denied", { trigger: true });
      },
    },
  });

  $("document").ready(() => {
    Backbone.history.start({
      pushState: true,
    });
  });

  catchNavigation();
}
