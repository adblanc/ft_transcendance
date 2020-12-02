import Backbone from "backbone";
import MainRouter from "./routers/MainRouter";
import { addAuthHeaders, catchNavigation } from "./utils";

export function start() {
  if (process.env.NODE_ENV === "development") {
    const token = localStorage.getItem("tokenAuth") || "";
    addAuthHeaders(token);
  }

  const mainRouter = new MainRouter();

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
