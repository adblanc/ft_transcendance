import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Profile from "src/models/Profile";
import { displayToast } from "src/utils/toast";
import MainRouter from "src/routers/MainRouter";


export default class ManageMemberView extends ModalView<Profile> {

  constructor(options?: Backbone.ViewOptions<Profile>) {
	super(options);

	/*maybe i don't need this*/
	this.listenTo(this.model, "change", this.render);
	this.listenTo(this.model, "add", this.render);
  }

  /*events() {
	return {
		...super.events(), "click #promote": "onPromote",
		...super.events(), "click #demote": "onDemote",
		...super.events(), "click #fire": "onFire",
		...super.events(), "click #transfer": "onTransfer",
	  };
  }

  displayError(error: string) {
    displayToast({ text: error }, "error");
  }*/

  render() {
    super.render();
    const template = $("#manageMemberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);
	
    return this;
  }
}
