import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import War from "src/models/War";
import { displaySuccess } from "src/utils";

//or maybe pass a guild
type Options = Backbone.ViewOptions & { war: War};

export default class MyGuildView extends BaseView {
  war: War;

  constructor(options?: Options) {
    super(options);

    this.war = options.war;
  }

  events() {
    return {
      "click #accept-btn": "onAcceptClicked",
    };
  }

  onAcceptClicked() {
  }


  render() {
	const template = $("#myWarTemplate").html();
    const html = Mustache.render(template, {}); //replace with this.war if it exists and if confirmed
	this.$el.html(html);
	  
    return this;
  }
}
