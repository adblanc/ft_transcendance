import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Profile from "src/models/Profile";
import { displayToast } from "src/utils/toast";
import MainRouter from "src/routers/MainRouter";
import Guild from "src/models/Guild";

type Options = Backbone.ViewOptions<Profile> & { guild: Guild, loggedIn: Profile };

export default class ManageMemberView extends ModalView<Profile> {
	guild: Guild;
	loggedIn: Profile;

  constructor(options?: Options) {
	super(options);

	this.guild = options.guild;
	this.loggedIn = options.loggedIn;
	this.listenTo(this.model, "change", this.render);
	this.listenTo(this.model, "add", this.render);
	this.listenTo(this.guild, "change", this.render);
	this.listenTo(this.loggedIn, "change", this.render);
	this.listenTo(this.guild.get("members"), "update", this.render);

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

  onDemoteClicked() {
	this.guild.manageMembers(
		"demote",
		this.model.get('id'),
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.saved("demote")
		);
  }

  onFireClicked() {
	this.guild.manageMembers(
		"fire",
		this.model.get('id'),
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.saved("fire")
		);
  }

  onTransferClicked() {
	this.guild.manageMembers(
		"transfer",
		this.model.get('id'),
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.saved("transfer")
		);
  }

  saved(method: string) {
	  if (method === "promote") {
		displayToast({ text: `You have successfully promoted ${this.model.get('name')}. ` }, "success");
	  }
	  else if (method === "demote") {
		displayToast({ text: `You have successfully demoted ${this.model.get('name')}. ` }, "success");
	  }
	  else if (method === "fire") {
		displayToast({ text: `You have successfully fired ${this.model.get('name')}. ` }, "success");
	  }
	  else if (method === "transfer") {
		displayToast({ text: `You have successfully transferred ownership to ${this.model.get('name')}. You are now an officer.` }, "success");
	  }
	this.guild.fetch();
	this.loggedIn.fetch();
	this.closeModal();
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
