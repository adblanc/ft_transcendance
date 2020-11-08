import Backbone from "backbone";
import Mustache from "mustache";

export default class ModalView<
  TModel extends Backbone.Model = Backbone.Model
> extends Backbone.View<TModel> {
  $content: any;

  constructor(options?: Backbone.ViewOptions<TModel>) {
    super(options);

    this.$content = undefined;
  }

  events() {
    return {
      "click #modal-backdrop": "closeModal",
      "click #modal-container": "dismissClick",
      "click #close-modal": "closeModal",
    };
  }

  closeModal() {
    console.log("we close modal");
    this.remove();
    this.unbind();
  }

  dismissClick(e: JQuery.Event) {
    e.stopPropagation();
  }

  render() {
    const template = $("#modalTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    $("body").append(this.$el);

    if (!this.$content) {
      this.$content = $("#modal-content");
    }

    return this;
  }
}
