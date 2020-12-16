import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";

export default class ModalView<
  TModel extends Backbone.Model = Backbone.Model
> extends BaseView<TModel> {
  $content: any;

  constructor(options?: Backbone.ViewOptions<TModel>) {
    super(options);

    this.$content = undefined;
  }

  events() {
    return {
      "click #modal-backdrop": this.close,
      "click #modal-container": this.dismissClick,
      "click #close-modal": this.close,
    };
  }

  dismissClick(e: JQuery.Event) {
    e.stopPropagation();
  }

  closeModal() {
    this.close();
  }

  render() {
    const template = $("#modalTemplate").html();
    const html = Mustache.render(template, {});
    this.$el.html(html);
    $("body").append(this.$el);

    this.$content = $("#modal-content");

    return this;
  }
}
