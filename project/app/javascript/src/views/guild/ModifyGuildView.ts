import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Guild from "src/models/Guild";
import { displayToast } from "src/utils/toast";
import MainRouter from "src/routers/MainRouter";
import { displayError, displayErrors } from "src/utils";

export default class ModifyGuildView extends ModalView<Guild> {
  constructor(options?: Backbone.ViewOptions<Guild>) {
    super(options);

    /*maybe i don't need this*/
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "add", this.render);
  }

  events() {
    return {
      ...super.events(),
      "click #input-guild-submit": "onSubmit",
      ...super.events(),
      "click #destroy-guild": "onDestroy",
    };
  }

  onDestroy(e: JQuery.Event) {
    //e.preventDefault();

    this.model.destroy();
    displayToast({ text: "Guild successfully destroyed." }, "success");
    this.closeModal();

    const router = new MainRouter();
    router.navigate("notFound", { trigger: true });
  }

  async onSubmit(e: JQuery.Event) {
    e.preventDefault();
    let acr = this.$("#input-guild-ang").val() as string;
    const attrs = {
      name: this.$("#input-guild-name").val() as string,
      ang: acr.toUpperCase(),
      img: (this.$("#input-guild-img")[0] as HTMLInputElement).files?.item(0),
    };

    if (!attrs.img) delete attrs.img;

    try {
      await this.model.modifyGuild(attrs);

      displayToast({ text: "Guild successfully updated." }, "success");
      this.closeModal();
      this.model.fetch();
    } catch (err) {
      displayErrors(err);
    }
  }

  guildSaved() {
    displayToast({ text: "Guild successfully updated." }, "success");
    this.closeModal();
    this.model.fetch();
  }

  render() {
    super.render(); // we render the modal
    const template = $("#guildEditFormTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
