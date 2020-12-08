import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Guild from "src/models/Guild";
import { displayToast } from "src/utils/toast";
import MainRouter from "src/routers/MainRouter";
import { generateAcn } from "src/utils/acronym";
import { displayError } from "src/utils";

export default class CreateGuildView extends ModalView<Guild> {
  idd: string;
  list: string[];

  constructor(options?: Backbone.ViewOptions<Guild>) {
    super(options);

    var tmp = [];
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "add", this.render);

    this.collection.forEach(function (item) {
      tmp.push(item.get("ang"));
    });
    this.list = tmp;
  }

  events() {
    return { ...super.events(), "click #input-guild-submit": "onSubmit" };
  }

  onSubmit(e: JQuery.Event) {
    e.preventDefault();
    var acn = generateAcn(
      this.$("#input-guild-name").val() as string,
      this.list
    ) as string;
    if (acn == "error") {
      displayError(
        "Acronym generation error : your chosen guild name is too similar to existing guild. Please choose another name."
      );
      acn = "";
    } else {
      const attrs = {
        name: this.$("#input-guild-name").val() as string,
        ang: acn,
        img: (this.$("#input-guild-img")[0] as HTMLInputElement).files?.item(0),
      };

      if (!attrs.img) delete attrs.img;

      this.model.createGuild(
        attrs,
        (errors) => {
          errors.forEach((error) => {
            displayError(error);
          });
        },
        () => this.guildSaved()
      );
    }
  }

  guildSaved() {
    displayToast({ text: "Guild successfully created." }, "success");
    this.closeModal();
    this.model.fetch();

    this.idd = this.model.id;
    const router = new MainRouter();
    router.navigate(`guild/${this.idd}`, { trigger: true });
  }

  render() {
    super.render(); // we render the modal
    const template = $("#guildFormTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
