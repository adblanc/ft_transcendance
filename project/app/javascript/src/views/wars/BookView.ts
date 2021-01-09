import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import War from "src/models/War";
import { displaySuccess, displayError } from "src/utils";

type Options = Backbone.ViewOptions<War> & { date: string};

export default class BookView extends ModalView<War> {
	date: string;

  constructor(options?: Options) {
    super(options);

	this.date = options.date;

	this.listenTo(this.model, "change", this.render);
	
  }

  render() {
    super.render();
    const template = $("#bookTemplate").html();
    const html = Mustache.render(template, {date: this.date } );
	this.$content.html(html);
	
    return this;
  }
}