import Backbone from "backbone";
import MainRouter from "./routers/MainRouter";
import { addAuthHeaders, catchNavigation } from "./utils";
import { appearanceChannel } from "../channels/appearance_channel";

export function start() {
  const token = localStorage.getItem("tokenAuth") || "";
  addAuthHeaders(token);

  const router = new MainRouter();

  $.ajaxSetup({
    statusCode: {
      401: () => {
        router.navigate("auth", { trigger: true });
      },
      403: () => {
        router.navigate("denied", { trigger: true });
      },
    },
  });
  router.on("route", (page) => {
    if (page === "game/:id") {
      appearanceChannel.perform("appear", { on: "in game" });
    } // il faudrait reset le "en jeu" apres avoir fini la partie pas ici je pense
  });

  $(document).ready(() => {
    Backbone.history.start({
      pushState: true,
    });

    catchNavigation();
  });
}
