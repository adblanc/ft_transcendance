import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";
import BaseModel from "src/lib/BaseModel";
import { IProfile } from "./Profile";

export default class User extends BaseModel<IProfile> {
  urlRoot = () => `${BASE_ROOT}/profile/`;
}
