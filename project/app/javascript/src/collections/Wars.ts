import Backbone from "backbone";
import War from "../models/War";

export default class Wars extends Backbone.Collection<War> {
  constructor() {
    super();

    this.model = War;
  }
}
