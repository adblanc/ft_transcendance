import Backbone from "backbone";
import Guild from "src/models/Guild";

export default class Guilds extends Backbone.Collection<Guild> {
  constructor(options?) {
    super(options);
    this.model = Guild;
  }
}
 