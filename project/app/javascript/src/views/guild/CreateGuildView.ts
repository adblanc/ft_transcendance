import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Guild from "src/models/Guild";
import { displayToast } from "src/utils/toast";


export default class CreateGuildView extends ModalView<Guild> {

  constructor(options?: Backbone.ViewOptions<Guild>) {
    super(options);


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
      //avatar: (this.$(
        //"#input-profile-avatar"
      //)[0] as HTMLInputElement).files?.item(0),
    };

    //if (!attrs.avatar) delete attrs.avatar;

    this.model.createGuild(
      attrs,
      (errors) => {
        errors.forEach((error) => {
          this.displayError(error);
        });
      },
      () => this.guildSaved()
    );
  }

  guildSaved() {
    displayToast({ text: "Guild successfully created." }, "success");
    this.closeModal();
    this.model.fetch();
  }

  displayError(error: string) {
    displayToast({ text: error }, "error");
  }

  render() {
    super.render(); // we render the modal
    const template = $("#guildFormTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
