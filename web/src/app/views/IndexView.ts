import Backbone from "backbone";
import NavbarView from "./NavbarView";

export default class IndexView extends Backbone.View {
    constructor(options?: Backbone.ViewOptions) {
        super(options);
    }

    render() {
        const navbarView = new NavbarView({
            el: "#container"
        });

        navbarView.render();

        return this;
    }
}
