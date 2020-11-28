import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "../../lib/BaseView";
import Profile from "src/models/Profile"
import ManageMemberView from "./ManageMemberView";

type Options = Backbone.ViewOptions & { model: Profile };

export default class MemberView extends BaseView {
  model: Profile;

  constructor(options?: Options) {
    super(options);

	this.model = options.model;
  }

  events() {
    return {
	  "click #manage-btn": "onManageClicked",
    };
  }

  onManageClicked() {
    const manageMemberView = new ManageMemberView({
	  model: this.model,
    });

    manageMemberView.render();
  }

  render() {
    const template = $("#memberTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
	this.$el.html(html);

    return this;
  }
}
