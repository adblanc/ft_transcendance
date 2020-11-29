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

  events() {
	return {
		...super.events(), "click #promote": "onPromoteClicked",
		...super.events(), "click #demote": "onDemoteClicked",
		...super.events(), "click #fire": "onFireClicked",
		...super.events(), "click #transfer": "onTransferClicked",
	  };
  }

  /*onPromoteClicked() {
	this.model.promote(
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.promote()
		);
  }

  promote() {
	displayToast({ text: `You have successfully promoted ${this.model.get('name')}. ` }, "success");
	this.model.fetch();

	Backbone.history.loadUrl();
  }

  onDemoteClicked() {
	this.model.demote(
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.demote()
		);
  }

  demote() {
	displayToast({ text: `You have successfully demoted ${this.model.get('name')}. ` }, "success");
	this.model.fetch();

	Backbone.history.loadUrl();
  }

  onFireClicked() {
	this.model.fire(
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.fire()
		);
  }

  fire() {
	displayToast({ text: `You have successfully fired ${this.model.get('name')}. ` }, "success");
	this.model.fetch();

	Backbone.history.loadUrl();
  }

  onTransferClicked() {
	this.model.transfer(
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.transfer()
		);
  }

  transfer() {
	displayToast({ text: `You have successfully transfered your ownership rights to ${this.model.get('name')}. ` }, "success");
	this.model.fetch();

	Backbone.history.loadUrl();
  }*/

  displayError(error: string) {
    displayToast({ text: error }, "error");
  }

  render() {
    super.render();
    const template = $("#manageMemberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);

	//disable button according to status
	if (this.model.get('guild_role') == "officer") {
		$('#promote').addClass('btn-disabled');
	}
	else {
		$('#demote').addClass('btn-disabled');
	}
	
    return this;
  }
}
