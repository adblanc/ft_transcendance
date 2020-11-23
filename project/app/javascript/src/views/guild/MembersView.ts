import Backbone from "backbone";
import Mustache from "mustache";
import Profile from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import MemberView from "./MemberView";

type Options = Backbone.ViewOptions & { guild: Backbone.Model };

export default class MembersView extends Backbone.View {
  //profiles: Backbone.Collection<Profile>;
  guild: Backbone.Model;

  constructor(options?: Options) {
    super(options);

	this.guild = options.guild;
	/*this.profiles = new Profiles();
	this.guild.get("users").forEach(function (user){
		//this.profiles.add(user);
	});*/

	this.listenTo(this.guild, "change", this.render);
	
  }

  render() {
    const template = $("#membersTemplate").html();
    const html = Mustache.render(template, this.guild.toJSON());
	this.$el.html(html);
	
	/*const $element = this.$("#listing");

    this.profiles.forEach(function (item) {
      //console.log(item);
      var memberView = new MemberView({
        model: item,
      });
      $element.append(memberView.render().el);
    });*/


    return this;
  }
}
