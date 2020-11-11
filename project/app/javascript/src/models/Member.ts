import Backbone from "backbone";

interface IMember {
  name: string;
  status: "Owner" | "Officer" | "Member";
  points: number;
}

export default class Member extends Backbone.Model<IMember> {}
