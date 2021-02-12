import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import ActivateView from "./ActivateView";
import ActiveWarTimeView from "./ActiveWarTimeView";
import War from "src/models/War";
import { currentUser } from "src/models/Profile";

type Options = Backbone.ViewOptions & { war: War};

export default class WarTimeView extends BaseView {
	war: War;

  constructor(options?: Options) {
    super(options);

	this.war = options.war;

	this.listenTo(this.war, "change", this.render);
	
  }

  events() {
    return {
	  "click #wartime-btn": "onActivateClicked",
    };
  }

  onActivateClicked() {
	const activateView = new ActivateView({
		model: this.war,
	  });
  
	  activateView.render();
  }

  render() {
    const template = $("#warTimeTemplate").html();
    const html = Mustache.render(template, {member: currentUser().get("guild_role") == "Member"});
	this.$el.html(html);

	if (this.war.get("atWarTime")) {
		const activeWarTimeView = new ActiveWarTimeView({
			war: this.war,
		  });
		this.renderNested(activeWarTimeView, "#active");
	}
	else {
		this.$("#not-active").show();
	}
	
    return this;
  }
}
