import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Guild from "src/models/Guild";
import Guilds from "src/collections/Guilds";
import Profile from "src/models/Profile";
import War from "src/models/War";
import { displaySuccess } from "src/utils/toast";
import moment from "moment";
const flatpickr = require("flatpickr");

type Options = Backbone.ViewOptions<War> & {
	guild: Guild, 
	profile: Profile;
 };

export default class DeclareWarView extends ModalView<War> {
	profile: Profile;
	guild: Guild;

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
	const fp_start = flatpickr(this.$("#input-start-date"), {
		enableTime: true,
		dateFormat: "Y-m-d H:i",
		minuteIncrement: 1,
		static: true,
		minDate: new Date(),
	});
	const fp_end = flatpickr(this.$("#input-end-date"), {
		enableTime: true,
		dateFormat: "Y-m-d H:i",
		minuteIncrement: 1,
		static: true,
		minDate: new Date(),
	});

	const dateTimeStart = fp_start.selectedDates[0];
    const dateTimeEnd = fp_end.selectedDates[0];

	var guilds = new Guilds;
	guilds.add(this.profile.get("guild"));
	guilds.add(this.guild);

    const attrs = {
	  start: dateTimeStart, //good format for rails?
	  end: dateTimeEnd, ////good format for rails?
	  prize: this.$("#input-prize").val() as string,
	  guilds: guilds,
    };

    const success = await this.model.createWar(attrs);
    if (success) {
      this.warSaved();
    }
  }

  warSaved() {
    displaySuccess(`You declared war to ${this.guild.get("name")}`);
    this.closeModal();
    //this.model.fetch();
    Backbone.history.navigate(`/warindex`, {
      trigger: true,
    });
  }

  render() {
    super.render();
    const template = $("#warFormTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
