import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War from "src/models/War";
import { displaySuccess, displayError } from "src/utils";

export default class TimetableView extends ModalView<War> {
  constructor(options?: Backbone.ViewOptions<War>) {
    super(options);

    this.listenTo(this.model, "change", this.render);
  }

  render() {
    super.render();
    const template = $("#timetableTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$content.html(html);
	
    return this;
  }
}
