import Backbone from "backbone";
import BaseView from "./BaseView";
import NavbarView from "./NavbarView";

export default class IndexView extends BaseView {
    navbarView: Backbone.View;

    constructor(options?: Backbone.ViewOptions) {
        super(options);

        this.navbarView = new NavbarView();
    }

    render() {
        this.navbarView.render();
        this.$el.html(this.navbarView.el);

        console.log("index el", this.$el);

        return this;
    }
}
