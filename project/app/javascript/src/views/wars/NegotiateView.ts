import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War, { WAR_ACTION } from "src/models/War";
import { displaySuccess, displayError } from "src/utils";
import Guild from "src/models/Guild";
const flatpickr = require("flatpickr");
require("flatpickr/dist/flatpickr.css")

type Options = Backbone.ViewOptions<War> & {
	guild: Guild, 
 };

export default class NegotiateView extends ModalView<War> {
	guild: Guild;
	fp_start: typeof flatpickr;
	fp_end: typeof flatpickr;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;

	this.listenTo(this.guild, "change", this.render);
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "add", this.render);
  }

  events() {
    return {
	  ...super.events(),
	  "click #negotiate": () => this.onModify,
      "click #accept": () => this.onAction("accept"),
      "click #reject": () => this.onAction("reject"),
    };
  }

  async onAction(action: WAR_ACTION) {
    const success = await this.model.manageAction(
      action,
    );

    if (success) {
      this.actionSaved(action);
    }
  }

  actionSaved(action: WAR_ACTION) {
    displaySuccess(
		`You have successfully ${action}ed the proposition of war.`
	);
	this.model.fetch();
	this.guild.fetch();
    this.closeModal();
  }

  async onModify(e: JQuery.Event) {
	e.preventDefault();
	
	const dateTimeStart = this.fp_start.selectedDates[0];
    const dateTimeEnd = this.fp_end.selectedDates[0];
	const start = dateTimeStart; 
	const end = dateTimeEnd;
	const prize = this.$("#input-prize").val() as string;

	//erreur ici
	if (parseInt(prize) > this.guild.get("warOpponent").get("points") || parseInt(prize) > this.guild.get("points")) {
		displayError("One or both guilds cannot wager that many points");
		return;
	}

    const success = await this.model.modifyWar(start, end, prize);

    if (success) {
      displaySuccess("You have successfully proposed new terms.");
      this.closeModal();
	  this.model.fetch();
	  this.guild.fetch();
    }
  }

  render() {
    super.render();
    const template = $("#negoTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);
	
	this.fp_start = flatpickr(this.$("#input-start-date"), {
		enableTime: true,
		dateFormat: "Y-m-d H:i",
		minuteIncrement: 1,
		static: true,
		minDate: new Date(),
	});
	this.fp_end = flatpickr(this.$("#input-end-date"), {
		enableTime: true,
		dateFormat: "Y-m-d H:i",
		minuteIncrement: 1,
		static: true,
		minDate: new Date(),
	});

    return this;
  }
}
