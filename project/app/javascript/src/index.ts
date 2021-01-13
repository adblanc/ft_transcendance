import Backbone from "backbone";
import MainRouter from "./routers/MainRouter";
import { addAuthHeaders, catchNavigation } from "./utils";

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

  $(document).ready(() => {
    Backbone.history.start({
      pushState: true,
    });

    catchNavigation();
  });
}
