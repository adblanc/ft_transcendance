import Backbone from "backbone";
import { currentUser } from "./models/Profile";
import MainRouter from "./routers/MainRouter";
import {
  addAuthHeaders,
  catchNavigation,
  listenVisibilityChanges,
} from "./utils";

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
    listenVisibilityChanges();
  });
}
