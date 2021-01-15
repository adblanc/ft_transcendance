import Backbone from "backbone";
import Mustache from "mustache";
import ModalView from "../ModalView";
import Profile, { currentUser } from "src/models/Profile";
import Guild, { GUILD_ACTION } from "src/models/Guild";
import { displaySuccess } from "src/utils";

type Options = Backbone.ViewOptions<Profile> & {
  guild: Guild;
};

export default class ManageMemberView extends ModalView<Profile> {
  guild: Guild;

  constructor(options?: Options) {
    super(options);

    this.guild = options.guild;
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "add", this.render);
    this.listenTo(this.guild, "change", this.render);
    this.listenTo(this.guild.get("members"), "update", this.render);
  }

  events() {
    return {
      ...super.events(),
      "click #promote": () => this.onManage("promote"),
      "click #demote": () => this.onManage("demote"),
      "click #fire": () => this.onManage("fire"),
      "click #transfer": () => this.onManage("transfer"),
    };
  }

  async onManage(action: GUILD_ACTION) {
    const success = await this.guild.manageMembers(
      action,
      this.model.get("id")
    );

    if (success) {
      this.saved(action);
    }
  }

  saved(action: GUILD_ACTION) {
    switch (action) {
      case "transfer":
        displaySuccess(
          `You have successfully transferred ownership to ${this.model.get(
            "name"
          )}. You are now an officer.`
        );
        break;
      default:
        displaySuccess(
          `You have successfully ${action}d ${this.model.get("name")}.`
        );
    }
    this.guild.fetch();
    currentUser().fetch();
    this.closeModal();
  }

  render() {
    super.render();
    const template = $("#manageMemberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$content.html(html);

    if (this.model.get("guild_role") == "Officer") {
      this.$("#promote").addClass("btn-disabled");
    } else {
      this.$("#demote").addClass("btn-disabled");
    }

    return this;
  }
}
