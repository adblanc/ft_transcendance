import Backbone from "backbone";

export type View<T> = Omit<Backbone.View, "events"> & {
    events: () => Record<string, keyof View<T>>;
};

export default class BaseView<
    TModel extends Backbone.Model = Backbone.Model
> extends Backbone.View<TModel> {
    onClose?: () => void;

    constructor(options?: Backbone.ViewOptions<TModel>) {
        super(options);
    }

    close() {
        this.remove();
        this.unbind();

        if (this.onClose) {
            this.onClose();
        }
    }
}
