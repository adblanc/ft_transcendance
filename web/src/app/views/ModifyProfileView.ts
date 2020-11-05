import Backbone from "backbone";
import Mustache from "mustache";
import $ from "jquery";
import ModalView from "./MovalView";

export default class ModifyProfileView extends ModalView {
    constructor(options?: Backbone.ViewOptions) {
        super(options);

        if (!this.model)
            throw "Please provide a profile model to ModifyProfileView";
    }

    render() {
        super.render();
        const template = $("#profileFormTemplate").html();
        const html = Mustache.render(template, this.model.toJSON());
        console.log("content", this.$content);
        this.$content.html(html);
        return this;
    }
}
