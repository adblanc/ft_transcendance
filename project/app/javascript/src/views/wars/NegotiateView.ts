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
	dateTimeStart: Date;
	dateTimeEnd: Date;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	this.profile = options.profile;
	this.dateTimeStart = this.model.get("start");
	this.dateTimeEnd = this.model.get("end");

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
	  "change #input-prize": "onChange",
	  "change #input-start-date": "onDateChange",
	  "change #input-end-date": "onDateChange",
	  "change #max-calls": "onChange",
	  "change #answer-time": "onChange",
    };
  }

  onChange(e: JQuery.Event) {
	e.preventDefault();
	this.$("#accept").addClass("btn-nego-disabled");
	this.$("#negotiate").removeClass("btn-nego-disabled");
  }

  onDateChange(e: Event) {
	e.preventDefault();
	this.$("#accept").addClass("btn-nego-disabled");
	this.$("#negotiate").removeClass("btn-nego-disabled");

	if ($(e.target).is("#input-start-date"))
		this.dateTimeStart = this.fp_start.selectedDates[0];
	if ($(e.target).is("#input-end-date"))
 		this.dateTimeEnd = this.fp_end.selectedDates[0];
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
	const start = this.dateTimeStart; 
	const end = this.dateTimeEnd;
	const prize = this.$("#input-prize").val() as string;
	const answer_time = this.$("#answer-time").val() as string;
	const max_calls = this.$("#max-calls").val() as string;

	if (parseInt(prize) > this.model.get("warOpponent").get("points") || parseInt(prize) > this.guild.get("points")) {
		displayError("One or both guilds cannot wager that many points");
		return;
	}

    const success = await this.model.modifyWar(start, end, prize, answer_time, max_calls);

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
			"MMM Do YY, h:mm a"
		),
		end: moment(this.model.get("end")).format(
		  "MMM Do YY, h:mm a"
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
		onChange: function(rawdate, altdate, FPOBJ) {
			FPOBJ.close();
			FPOBJ._input.blur();
		}
	});
	this.fp_end = flatpickr(this.$("#input-end-date"), {
		enableTime: true,
		dateFormat: "Y-m-d H:i",
		minuteIncrement: 1,
		static: true,
		minDate: new Date(),
		onChange: function(rawdate, altdate, FPOBJ) {
			FPOBJ.close();
			FPOBJ._input.blur();
		}
	});

    return this;
  }
}
