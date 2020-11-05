import Backbone from "backbone";
import Mustache from "mustache";
import $ from "jquery";

export default class ModalView extends Backbone.View {
    $content: any;
    constructor(options?: Backbone.ViewOptions) {
        super({ ...options, el: "body" });

        this.$content = undefined;
    }

    events() {
        return {
            "click #modal-backdrop": "closeModal",
            "click #modal-container": "dismissClick",
            "click #close-modal": "closeModal"
        };
    }

    closeModal() {
        console.log("close modal");
        this.$("#modal-backdrop").remove();
    }

    dismissClick(e: JQuery.Event) {
        e.stopPropagation();
    }

    render() {
        const template = $("#modalTemplate").html();
        const html = Mustache.render(template, {});
        this.$el.append(html);

        if (!this.$content) {
            this.$content = $("#modal-content");
        }

        return this;
    }
}
