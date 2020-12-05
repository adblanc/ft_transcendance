import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile from "src/models/Profile";
import Guild from "src/models/Guild";
import { displayToast } from "src/utils/toast";

type Options = Backbone.ViewOptions & { model: Profile, guild: Guild };

export default class PendingMemberView extends BaseView {
  model: Profile;
  guild: Guild;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
	this.guild = options.guild;

	this.listenTo(this.model, "change", this.render);
	this.listenTo(this.model, "add", this.render);
	this.listenTo(this.guild, "add", this.render);
	this.listenTo(this.guild, "delete", this.render);
  }

  events() {
	return {
		"click #accept-btn": "onAcceptClicked",
		"click #refuse-btn": "onRefuseClicked",
	  };
  }

  onAcceptClicked() {
	this.guild.accept(
		this.model.get('id'),
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.saved("accept")
		);
  }

  onRefuseClicked() {
	this.guild.reject(
		this.model.get('id'),
		(errors) => {
			errors.forEach((error) => {
			this.displayError(error);
			});
		},
		() => this.saved("refuse")
		);
  }


  saved(method: string) {
	  if (method === "accept") {
		displayToast({ text: `You have accepted ` }, "success");
	  }
	  else if (method === "refuse") {
		displayToast({ text: `You have refused ` }, "success");
	  }
	this.guild.fetch();
  }

  displayError(error: string) {
    displayToast({ text: error }, "error");
  }

  render() {
    const template = $("#pendingMemberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);

    return this;
  }
}
