import Backbone from "backbone";
import Mustache from "mustache";
//import axios from "axios";
//import { get42LoginUrl } from "../utils/api";
//import { addAuthHeaders } from "../utils/auth";
//import { displayError } from "../utils/toast";
import BaseView from "src/lib/BaseView";
//import { BASE_ROOT } from "src/constants";

export default class TfaView extends BaseView {
	events() {
		return {
			"keypress #input-tfa": "loginTfa",
		};
	}

	loginTfa(e: JQuery.Event) {
		if (e.key === "Enter") {
			const input = this.$("#input-tfa").val();
			e.preventDefault();
			if (!input) { return ; }
	        this.$("#input-tfa").val("");
		}
	}

//      try {
//        const { data: token } = await axios.get(
//          `${BASE_ROOT}/auth/guest?login=${input}`
//        );
//        addAuthHeaders(token);
//      } catch (ex) {
//        displayError(`${input} n'est pas un guest valide.`);
//        return;
//      }
//
//      Backbone.history.navigate("/", { trigger: true });
//    }
//  }

  render() {
    const template = $("#tfaTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    return this;
  }
}
