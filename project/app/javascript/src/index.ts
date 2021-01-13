import Backbone from "backbone";
import MainRouter from "./routers/MainRouter";
import { addAuthHeaders, catchNavigation } from "./utils";

export function start() {
  if (process.env.NODE_ENV === "development") {
    const token = localStorage.getItem("tokenAuth") || "";
    addAuthHeaders(token);
  }

  const router = new MainRouter();

  $(document).ready(() => {
    Backbone.history.start({
      pushState: true,
    });

    catchNavigation();
  });
}
