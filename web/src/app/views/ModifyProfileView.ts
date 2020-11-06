import Backbone from "backbone";
import Mustache from "mustache";
import $ from "jquery";
import ModalView from "./MovalView";
import Profile from "../models/Profile";
import { displayErrorToast } from "../utils/toast";

export default class ModifyProfileView extends ModalView<Profile> {
    constructor(options?: Backbone.ViewOptions<Profile>) {
        super(options);

        if (!this.model)
            throw Error("Please provide a profile model to ModifyProfileView");
    }

    events() {
        return { ...super.events(), "click #input-profile-submit": "onSubmit" };
    }

    onSubmit(e: JQuery.Event) {
        e.preventDefault();
        this.model.set({
            name: this.$("#input-profile-name").val() as string
        });
        this.model.save(
            {},
            {
                url: this.model.urlRoot(),
                error: (_, jqxhsr) => {
                    // server-side validation error
                    this.handleServerSideErrors(jqxhsr?.responseJSON);
                }
            }
        );
        if (!this.model.isValid()) {
            // client side valiation error
            this.displayError(this.model.validationError);
        }
    }

    handleServerSideErrors(errors: Record<string, string[]>) {
        this.mapServerErrors(errors).forEach((error) => {
            this.displayError(error);
        });
    }

    mapServerErrors(errors: Record<string, string[]>) {
        return Object.keys(errors).map(
            (key) => `${key} ${errors[key].join(",")}`
        );
    }

    displayError(error: string) {
        displayErrorToast({ text: error });
    }

    render() {
        super.render(); // we render the modal
        const template = $("#profileFormTemplate").html();
        const html = Mustache.render(template, this.model.toJSON());
        this.$content.html(html);
        return this;
    }
}
