import Backbone from "backbone";

export default class User extends Backbone.Model {
  urlRoot = () => "http://localhost:3000/profile/";
}
