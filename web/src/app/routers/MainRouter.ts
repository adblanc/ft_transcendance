import Backbone from "backbone";
import { RouterOptions } from "../types/router";
import IndexView from "../views/IndexView";

export default class MainRouter extends Backbone.Router {
    constructor(options?: RouterOptions<MainRouter>) {
        super(options);
    }

    index() {
        const indexView = new IndexView({
            el: "body"
        });

        indexView.render();
    }
}
