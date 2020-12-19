import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Guild from "src/models/Guild";
import Profile from "src/models/Profile";
import War from "src/models/War";
import { displayError, displaySuccess } from "src/utils/toast";
const flatpickr = require("flatpickr");
require("flatpickr/dist/flatpickr.css")

type Options = Backbone.ViewOptions<War> & {
	guild: Guild, 
	profile: Profile;
 };

export default class DeclareWarView extends ModalView<War> {
	profile: Profile;
	guild: Guild;
	fp_start: typeof flatpickr;
	fp_end: typeof flatpickr;

  constructor(options?: Options) {
	super(options);
	
	this.profile = options.profile;
	this.guild = options.guild;

  }

  events() {
    return { ...super.events(), "click #input-war-submit": "onSubmit" };
  }

  async onSubmit(e: JQuery.Event) {
	e.preventDefault();

	const dateTimeStart = this.fp_start.selectedDates[0];
    const dateTimeEnd = this.fp_end.selectedDates[0];
	const start = dateTimeStart; 
	const end = dateTimeEnd;
	const prize = this.$("#input-prize").val() as string;

	const initiator_id = this.profile.get("guild").get("id");
	const recipient_id = this.guild.get("id");

	if (parseInt(prize) > this.profile.get("guild").get("points") || parseInt(prize) > this.guild.get("points")) {
		displayError("One or both guilds cannot wager that many points");
		return;
	}

    const success = await this.model.createWar(start, end, prize, initiator_id, recipient_id);
    if (success) {
      this.warSaved();
    }
  }

  warSaved() {
    displaySuccess(`You declared war to ${this.guild.get("name")}`);
    this.closeModal();
    this.model.fetch();
    Backbone.history.navigate(`/warindex`, {
      trigger: true,
    });
  }

  render() {
    super.render();
    const template = $("#warFormTemplate").html();
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
