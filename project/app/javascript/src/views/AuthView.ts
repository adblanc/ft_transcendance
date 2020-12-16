import Backbone from "backbone";
import Mustache from "mustache";
import axios from "axios";
import { get42LoginUrl } from "../utils/api";
import { addAuthHeaders } from "../utils/auth";
import { displayError } from "../utils/toast";
import BaseView from "src/lib/BaseView";
import { BASE_ROOT } from "src/constants";

export default class AuthView extends BaseView {
  events() {
    return {
      "keypress #input-guest": "loginGuest",
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
          `${BASE_ROOT}/auth/guest?login=${input}`
        );
        addAuthHeaders(token);
      } catch (ex) {
        displayError(`${input} n'est pas un guest valide.`);

        this.$("#input-guest").val("");

        return;
      }

      Backbone.history.navigate("/", { trigger: true });
    }
  }

  render() {
    const template = $("#loginTemplate").html();
    const html = Mustache.render(template, {
      "42_LOGIN_URL": get42LoginUrl(),
    });
    this.$el.html(html);
    return this;
  }
}
