import Backbone from "backbone";
import Mouvement from "../models/Mouvement";

export default class Mouvements extends Backbone.Collection<Mouvement> {
  constructor() {
    super();

    this.model = Mouvement;
  }
}