import Backbone from "backbone";
import BaseView from "./BaseView";
import NavbarView from "./NavbarView";

export default class IndexView extends BaseView {
    constructor(options?: Backbone.ViewOptions) {
        super(options);
    }

    render() {
        console.log("render index view");
        const navbarView = new NavbarView({});

        navbarView.render();

        this.$el.html(navbarView.el);

        return this;
    }
}
