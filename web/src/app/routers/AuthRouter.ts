import Backbone from "backbone";
import axios from "axios";
import { RouterOptions } from "../types/router";
import AuthView from "../views/AuthView";
import { addAuthHeaders } from "../utils/auth";

export default class AuthRouter extends Backbone.Router {
    constructor(options?: RouterOptions<AuthRouter>) {
        super(options);
    }

    async authCallBack(code: string) {
        try {
            const { data } = await axios.get(
                "http://localhost:5000/auth/42?code=" + code
            );
            addAuthHeaders({ Authorization: `Bearer ${data}` });
            this.navigate("/", { trigger: true });
        } catch (ex) {
            this.navigate("/auth", { trigger: true });
        }
    }

    auth() {
        const authView = new AuthView({
            el: "body"
        });

        authView.render();
    }
}
