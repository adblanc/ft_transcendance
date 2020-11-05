import Backbone from "backbone";
import { viewsHandler } from "../lib/ViewsHandler";
import { RouterOptions } from "../types/router";
import IndexView from "../views/IndexView";

export default class MainRouter extends Backbone.Router {
    constructor(options: RouterOptions<MainRouter>) {
        super(options);
    }

    index() {
        const indexView = new IndexView({});

        viewsHandler.showView(indexView);
    }
}
