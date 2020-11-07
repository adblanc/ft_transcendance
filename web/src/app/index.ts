import Backbone from "backbone";
import $ from "jquery";
import AuthRouter from "./routers/AuthRouter";
import MainRouter from "./routers/MainRouter";
import { addAuthHeaders } from "./utils";

if (module.hot) {
    module.hot.accept();
}

if (process.env.NODE_ENV === "development") {
    const token = localStorage.getItem("tokenAuth") || "";
    addAuthHeaders(token);
}

const authRouter = new AuthRouter({
    routes: {
        auth: "auth",
        "auth/callback?code=:code": "authCallBack"
    }
});

const mainRouter = new MainRouter({
    routes: {
        "": "index"
    }
});

$.ajaxSetup({
    statusCode: {
        401: () => {
            authRouter.navigate("auth", { trigger: true });
        },
        403: () => {
            authRouter.navigate("denied", { trigger: true });
        }
    }
});

$("document").ready(() => {
    try {
        Backbone.history.start({
            pushState: true
        });
    } catch (ex) {}
});
