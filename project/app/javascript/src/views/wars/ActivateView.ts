import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War from "src/models/War";
import { displaySuccess, displayError } from "src/utils";
const flatpickr = require("flatpickr");
require("flatpickr/dist/flatpickr.css");

export default class ActivateView extends ModalView<War> {
	fp_end: typeof flatpickr;

  constructor(options?: Backbone.ViewOptions<War>) {
    super(options);

    this.listenTo(this.model, "change", this.render);
  }

  events() {
    return { ...super.events(), "click #input-wartime-submit": "onSubmit" };
  }

  async onSubmit(e: JQuery.Event) {
	e.preventDefault();
	
    const dateTimeEnd = this.fp_end.selectedDates[0];
	const end = dateTimeEnd;

    const success = await this.model.activateWarTime(end);
    if (success) {
      this.warTimeSaved();
    }
  }

  warTimeSaved() {
    displaySuccess(`You activated War Time for your current War!`);
    this.closeModal();
    this.model.fetch();
  }

  dismiss = (e: JQuery.ClickEvent) => {
    if ($(e.target).closest(".flatpickr-wrapper").length === 0) {
		this.fp_end.close();
    }
  };

  render() {
    super.render();
    const template = $("#warTimeFormTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);
	
	this.fp_end = flatpickr(this.$("#input-end-date"), {
		enableTime: true,
		dateFormat: "Y-m-d H:i",
		minuteIncrement: 1,
		static: true,
		minDate: new Date(),
	});

	this.$content.on("click", this.dismiss);
    return this;
  }
}
