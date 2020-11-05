import Backbone from "backbone";
import Profile from "../models/Profile";
import ProfileView from "./ProfileView";

export default class IndexView extends Backbone.View {
    constructor(options?: Backbone.ViewOptions) {
        super(options);
    }

    render() {
        const profile = new Profile();
        const profileView = new ProfileView({
            model: profile,
            el: "#container"
        });

        profileView.render();

        profile.fetch();
        //this.$el.html(`Index page`);
        return this;
    }
}
