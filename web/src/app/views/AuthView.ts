import Backbone from "backbone";
import Mustache from "mustache";
import $ from "jquery";
import axios from "axios";
import { get42LoginUrl } from "../utils/api";
import { addAuthHeaders } from "../utils/auth";

export default class AuthView extends Backbone.View {
    constructor(options?: Backbone.ViewOptions) {
        super(options);
    }

    events() {
        return {
            "keypress #input-guest": "loginGuest"
        };
    }

    async loginGuest(e: JQuery.Event) {
        if (e.key === "Enter") {
            e.preventDefault();
            try {
                const { data: token } = await axios.get(
                    `http://localhost:5000/auth/guest?login=${this.$(
                        "#input-guest"
                    ).val()}`
                );
                addAuthHeaders(token);
            } catch (ex) {
                console.error(ex);

                return;
            }

            Backbone.history.navigate("/", { trigger: true });
        }
    }

    render() {
        const template = $("#loginTemplate").html();
        const html = Mustache.render(template, {
            "42_LOGIN_URL": get42LoginUrl()
        });
        this.$el.html(html);
        return this;
    }
}
