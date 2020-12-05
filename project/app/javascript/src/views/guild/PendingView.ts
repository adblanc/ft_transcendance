import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import { displayToast } from "src/utils/toast";
import MainRouter from "src/routers/MainRouter";
import Guild from "src/models/Guild";
import PendingMemberView from "./PendingMemberView";

export default class PendingView extends ModalView<Guild> {
	profiles: Profiles;

  constructor(options?: Backbone.ViewOptions<Guild>) {
	super(options);

	this.profiles = this.model.get("pending_members");

	this.listenTo(this.model, "change", this.render);
	this.listenTo(this.model, "add", this.render);
	this.listenTo(this.model, "delete", this.render);
	this.listenTo(this.profiles, "update", this.render);

  }


  render() {
    super.render();
    const template = $("#pendingTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);

	const $element = this.$("#listing");

	this.profiles.forEach(function (item) {
		var memberView = new PendingMemberView({
		  model: item,
		  guild: this.model,
		});
		$element.append(memberView.render().el);
	  }, this);
	  
	
    return this;
  }
}
