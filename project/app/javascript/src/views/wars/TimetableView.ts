import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import BookView from "./BookView";
import War from "src/models/War";
import { displaySuccess, displayError } from "src/utils";
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default class TimetableView extends ModalView<War> {
	timetable: typeof Calendar;

  constructor(options?: Backbone.ViewOptions<War>) {
    super(options);

	this.listenTo(this.model, "change", this.render);
	
	//this.model.get("war_times").forEach(
  }


  render() {
    super.render();
    const template = $("#timetableTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);

	var $element: JQuery = $(this.$("#timetable"));
    var element: HTMLElement = $element.get(0);
	var timetable = new Calendar(element, {
		plugins: [ dayGridPlugin, timeGridPlugin,  interactionPlugin ],
		initialView: 'timeGridWeek',
		allDaySlot: false,
		validRange: {
			start: Date(),
			//end: TBD
		},
		selectable: true,
		selectOverlap: false,
		dateClick: function(info) {
			const bookView = new BookView({
				model: this.model,
				date: info.dateStr,
			});
			bookView.render();
		}
		//initialresources
	});
	timetable.render();
	
    return this;
  }
}
