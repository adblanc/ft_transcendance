import Backbone from "backbone";
import "backbone-associations";
import { mapServerErrors } from "src/utils";

export default class BaseModel<
  T = any,
  S = Backbone.ModelSetOptions,
  E = {}
> extends Backbone.AssociatedModel<T, S, E> {
  asyncFetch(options?: Backbone.ModelFetchOptions): Promise<this> {
    return new Promise((res, rej) => {
      this.fetch({
        ...options,
        success: () => res(this),
        error: (_, jqxhr) => {
          rej(mapServerErrors(jqxhr.responseJSON));
        },
      });
    });
  }

  asyncDestroy(options?: Backbone.ModelDestroyOptions): Promise<this> {
    return new Promise((res, rej) => {
      this.destroy({
        ...options,
        success: () => res(this),
        error: (_, jqxhr) => {
          rej(mapServerErrors(jqxhr.responseJSON));
        },
      });
    });
  }

  asyncSave(
    attrs?: any,
    options?: Backbone.ModelSaveOptions
  ): Promise<this | false> {
    return new Promise((res, rej) => {
      const valid = this.save(attrs, {
        ...options,
        success: () => res(this),
        error: (_, jqxhr) => rej(mapServerErrors(jqxhr.responseJSON)),
      });
      if (!valid) {
        rej([this.validationError]);
      }
    });
  }
}
