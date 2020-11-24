import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Guild from "src/models/Guild";
import { displayToast } from "src/utils/toast";


export default class ModifyGuildView extends ModalView<Guild> {

  constructor(options?: Backbone.ViewOptions<Guild>) {
    super(options);

	/*maybe i don't need this*/
	this.listenTo(this.model, "change", this.render);
	this.listenTo(this.model, "add", this.render);
  }

  events() {
    return { ...super.events(), "click #input-guild-submit": "onSubmit" };
  }

  onSubmit(e: JQuery.Event) {
	e.preventDefault();
	const attrs = {
	name: this.$("#input-guild-name").val() as string,
	ang: this.$("#input-guild-ang").val() as string,
	img: (this.$(
		"#input-guild-img"
	)[0] as HTMLInputElement).files?.item(0),
	};

	if (!attrs.img) delete attrs.img;

	this.model.modifyGuild(
	attrs,
	this.model.get('id'),
	(errors) => {
		errors.forEach((error) => {
		this.displayError(error);
		});
	},
	() => this.guildSaved()
	);
  }

  guildSaved() {
    displayToast({ text: "Guild successfully updated." }, "success");
	this.closeModal();
	this.model.fetch();
  }

  displayError(error: string) {
    displayToast({ text: error }, "error");
  }

  render() {
    super.render(); // we render the modal
    const template = $("#guildEditFormTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
