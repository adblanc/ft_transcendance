import Backbone from "backbone";
import Mustache from "mustache";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import $ from "jquery";
import axios from "axios";
import { get42LoginUrl } from "../utils/api";
import { addAuthHeaders } from "../utils/auth";
import BaseView from "./BaseView";

export default class AuthView extends BaseView {
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
            const input = this.$("#input-guest").val();
            e.preventDefault();
            if (!input) {
                return;
            }
            try {
                const { data: token } = await axios.get(
                    `http://localhost:5000/auth/guest?login=${input}`
                );
                addAuthHeaders(token);
            } catch (ex) {
                Toastify({
                    text: `${input} n'est pas un guest valide.`,
                    backgroundColor:
                        "linear-gradient(90deg, rgba(247,122,16,1) 30%, rgba(255,0,46,1) 100%)"
                }).showToast();

                this.$("#input-guest").val("");

                return;
            }

            Backbone.history.navigate("/", { trigger: true });
        }
    }

    render() {
        console.log("render auth");
        const template = $("#loginTemplate").html();
        const html = Mustache.render(template, {
            "42_LOGIN_URL": get42LoginUrl()
        });
        this.$el.html(html);
        return this;
    }
}
