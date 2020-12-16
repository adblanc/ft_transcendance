import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";

export default class User extends Backbone.Model {
  urlRoot = () => `${BASE_ROOT}/profile/`;
}
