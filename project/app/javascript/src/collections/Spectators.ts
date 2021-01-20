import Backbone from "backbone";
import Spectator from "src/models/Spectator";

export default class Spectators extends Backbone.Collection<Spectator> {
  preinitialize() {
    this.model = Spectator;
  }
}
