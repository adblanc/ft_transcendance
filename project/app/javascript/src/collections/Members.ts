import Backbone from "backbone";
import Member from "../models/Member";

export default class Members extends Backbone.Collection<Member> {
  constructor() {
    super();

    this.model = Member;
  }
}
