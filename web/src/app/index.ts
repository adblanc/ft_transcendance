import Backbone from "backbone";
import $ from "jquery";
import AuthRouter from "./routers/AuthRouter";
import MainRouter from "./routers/MainRouter";

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
            console.log("we got a 401");
            authRouter.navigate("auth", { trigger: true });
        },
        403: () => {
            authRouter.navigate("denied", { trigger: true });
        }
    }
});

$("document").ready(() => {
    Backbone.history.start({
        pushState: true
    });
});
