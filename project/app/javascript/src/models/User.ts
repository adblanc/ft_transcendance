import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import { IProfile } from "./Profile";

export default class User extends Backbone.Model<IProfile> {
  urlRoot = () => `${BASE_ROOT}/profile/`;
}
