import Backbone from "backbone";
import Mustache from "mustache";
import DeclareWarView from "./DeclareWarView";
import BaseView from "../../lib/BaseView";
import War, { WarTimeDates } from "src/models/War";
const flatpickr = require("flatpickr");
import { eventBus } from "src/events/EventBus";
import { displayError, displaySuccess } from "src/utils/toast";
import WarTime from "src/models/WarTime";
import { eventBus } from "src/events/EventBus";
require("flatpickr/dist/flatpickr.css");

type Options = Backbone.ViewOptions & {
	viewId: number;
	wartime: WarTime;
  };

export default class WarTimeFormNegoView extends BaseView{
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


  render() {
    const template = $("#warTimesNegoFormTemplate").html();
    const html = Mustache.render(template, this.wartime.toJSON());
    this.$el.html(html);

    return this;
  }
}
