import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War, { WAR_ACTION } from "src/models/War";
import { displaySuccess, displayError } from "src/utils";
import Guild from "src/models/Guild";
const flatpickr = require("flatpickr");
require("flatpickr/dist/flatpickr.css")
import moment from "moment";
import Profile from "src/models/Profile";

type Options = Backbone.ViewOptions<War> & {
	guild: Guild, 
	profile: Profile,
 };

export default class NegotiateView extends ModalView<War> {
	guild: Guild;
	profile: Profile;
	fp_start: typeof flatpickr;
	fp_end: typeof flatpickr;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.profile = options.profile;

	this.listenTo(this.guild, "change", this.render);
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "add", this.render);
  }

  events() {
    return {
	  ...super.events(),
	  "click #negotiate": "onModify",
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
	console.log("test");
	const dateTimeStart = this.fp_start.selectedDates[0];
    const dateTimeEnd = this.fp_end.selectedDates[0];
	const start = dateTimeStart; 
	const end = dateTimeEnd;
	const prize = this.$("#input-prize").val() as string;

	if (parseInt(prize) > this.model.get("warOpponent").get("points") || parseInt(prize) > this.guild.get("points")) {
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
	const model = {
		...this.model.toJSON(),
		start: moment(this.model.get("start")).format(
			"YYYY-MM-DDTHH:mm"
		),
		end: moment(this.model.get("end")).format(
		  "YYYY-MM-DDTHH:mm"
		)
	};

    super.render();
    const template = $("#negoTemplate").html();
    const html = Mustache.render(template, {
		war: model,
		img: this.model.get("warOpponent").get("img_url"),
		name: this.model.get("warOpponent").get("name"),
		url: `/guild/${this.model.get("warOpponent").get("id")}`,	
	});
	this.$content.html(html);
	
	const $ranked = this.$("#ranked");
    const $member = this.$("#member");

	if(this.profile.get("guild_role") == "Member") {
		$member.show();
		this.$("#input-start-date").prop( "disabled", true );
		this.$("#input-end-date").prop( "disabled", true );
		this.$("#input-prize").prop( "disabled", true );
	} else {
		$ranked.show();
	}

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
