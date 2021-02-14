import Backbone from "backbone";
import Mustache from "mustache";
import DeclareWarView from "./DeclareWarView";
import BaseView from "../../lib/BaseView";
import War, { WarTimeDates } from "src/models/War";
const flatpickr = require("flatpickr");
import { eventBus } from "src/events/EventBus";
import { displayError, displaySuccess } from "src/utils/toast";
import WarTime from "src/models/WarTime";
require("flatpickr/dist/flatpickr.css");

type Options = Backbone.ViewOptions & {
	viewId: number;
	wartime: WarTime;
  };

export default class WarTimeFormNegoView extends BaseView{
  fp_start: typeof flatpickr;
  fp_end: typeof flatpickr;
  viewId: number;
  wartime: WarTime;

  constructor(options?: Options) {
    super(options);

	this.viewId = options.viewId;
	this.wartime = options.wartime;
  }

  events() {
	return {
		"click #remove-war-time": "onRemoveWT"
	};
  }
	  
	onRemoveWT(e: JQuery.Event) {
		e.preventDefault();
		eventBus.trigger("wartime:remove", this.viewId);
		this.close();
	}


  dismiss = (e: JQuery.ClickEvent) => {
    if ($(e.target).closest(".flatpickr-wrapper").length === 0) {
		this.fp_start.close();
		this.fp_end.close();
    }
  };

  render() {
    const template = $("#warTimesNegoFormTemplate").html();
    const html = Mustache.render(template, this.wartime.toJSON());
    this.$el.html(html);

    this.fp_start = flatpickr(this.$("#wt-start-date"), {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      minuteIncrement: 1,
      static: true,
      minDate: new Date(),
    }, this);
    this.fp_end = flatpickr(this.$("#wt-end-date"), {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      minuteIncrement: 1,
      static: true,
      minDate: new Date(),
	});

	this.$el.on("click", this.dismiss);
    return this;
  }
}
