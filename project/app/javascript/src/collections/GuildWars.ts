import Backbone from "backbone";
import GuildWar from "../models/GuildWar";

export default class GuildWars extends Backbone.Collection<GuildWar> {
  constructor() {
    super();

	this.model = GuildWar;
  }
}
