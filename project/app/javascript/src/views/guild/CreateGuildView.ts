import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Guild from "src/models/Guild";
import { displayToast } from "src/utils/toast";

type Options = Backbone.ViewOptions & {guild: Backbone.Model};

export default class CreateGuildView extends ModalView {
  guild: Backbone.Model;

  constructor(options?: Options) {
    super(options);

    this.guild = options.guild;

	this.listenTo(this.guild, "change", this.render);
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

    /*this.model.createGuild(
      attrs,
      (errors) => {
        errors.forEach((error) => {
          this.displayError(error);
        });
      },
      () => this.guildSaved()
    );*/
  }

  guildSaved() {
    displayToast({ text: "Guild successfully created." }, "success");
    this.closeModal();
    this.guild.fetch();
  }

  displayError(error: string) {
    displayToast({ text: error }, "error");
  }

  render() {
    super.render(); // we render the modal
    const template = $("#guildFormTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
    this.$content.html(html);
    return this;
  }
}
