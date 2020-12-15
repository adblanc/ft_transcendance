import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Guild from "src/models/Guild";
import Profile from "src/models/Profile";
import War from "src/models/War";
import { displaySuccess } from "src/utils/toast";

type Options = Backbone.ViewOptions<War> & {
	guild: Guild, 
	profile: Profile;
 };

export default class DeclareWarView extends ModalView<War> {
	profile: Profile;
	guild: Guild;

  constructor(options?: Options) {
	super(options);
	
	this.profile = options.profile;
	this.guild = options.guild;
  }

  events() {
    return { ...super.events(), "click #input-war-submit": "onSubmit" };
  }

  async onSubmit(e: JQuery.Event) {
    e.preventDefault();
    const attrs = {
      start: this.$("#input-start-date").val() as string, //as Date
	  end: this.$("#input-end-date").val() as string, //as Date
	  prize: this.$("#input-prize").val() as string,
    };

    const success = await this.model.createWar(attrs, this.profile.get("guild").get("id"), this.guild.get("id"));
    if (success) {
      this.warSaved();
    }
  }

  warSaved() {
    displaySuccess(`You declared war to ${this.guild.get("name")}`);
    this.closeModal();
    //this.model.fetch();
    Backbone.history.navigate(`/warindex`, {
      trigger: true,
    });
  }

  render() {
    super.render();
    const template = $("#warFormTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);
    return this;
  }
}
