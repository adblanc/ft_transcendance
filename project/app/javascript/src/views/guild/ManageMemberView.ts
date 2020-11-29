import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Profile from "src/models/Profile";
import { displayToast } from "src/utils/toast";
import MainRouter from "src/routers/MainRouter";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions<Profile> & { guild: Guild };

export default class ManageMemberView extends ModalView<Profile> {
	guild: Guild;

  constructor(options?: Options) {
	super(options);

	this.guild = options.guild;
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

  onPromoteClicked() {
	this.guild.manageMembers(
		"promote",
		this.model.get('id'),
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.saved("promote")
		);
  }

  saved(method: string) {
	  if (method === "promote") {
		displayToast({ text: `You have successfully promoted ${this.model.get('name')}. ` }, "success");
	  }
	this.closeModal();
	this.model.fetch();
	Backbone.history.loadUrl();
  }

  displayError(error: string) {
    displayToast({ text: error }, "error");
  }

  render() {
    super.render();
    const template = $("#manageMemberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);

	//disable button according to status
	if (this.model.get('guild_role') == "Officer") {
		$('#promote').addClass('btn-disabled');
	}
	else {
		$('#demote').addClass('btn-disabled');
	}
	
    return this;
  }
}
