import Backbone from "backbone";
import GuildWar from "../models/War";

export default class Wars extends Backbone.Collection<GuildWar> {
  constructor() {
    super();

	this.model = GuildWar;
  }
}
