import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import CreateGuildView from "./CreateGuildView";
import PageView from "src/lib/PageView";

export default class GuildView extends PageView {
  //model: Backbone.Model;

  constructor(options?: Backbone.ViewOptions) {
    super(options);
  }

  events() {
    return {
      "click #create-btn": "onCreateClicked",
    };
  }

  onCreateClicked() {
    const guild = new Guild();
    const createGuildView = new CreateGuildView({
      model: guild,
    });

    createGuildView.render();
  }

  render() {
    const template = $("#guildIndexTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);

    return this;
  }
}
