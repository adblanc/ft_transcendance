import Backbone from "backbone";
import Mustache from "mustache";
import Guild from "src/models/Guild";
import User from "src/models/User";
import BaseView from "src/lib/BaseView";

type Options = Backbone.ViewOptions & { userId: number }

export default class UserView extends BaseView {
	user: User;

	constructor(options: Options) {
		super(options);

		this.user = new User({ id: options.userId });
		this.user.fetch({ error: this.onFetchError });
		//marche po
		this.listenTo(this.user, "change", this.render);
	}

	onFetchError() {
		Backbone.history.navigate("/not-found", { trigger: true });
	}

	render() {
		const template = $("#userPageTemplate").html();
		var date = this.user.attributes.created_at?.split("T")[0].split("-");
		date = date !== undefined ? date[2] + "/" + date[1] + "/" + date[0] : undefined;
		console.log(this.model?.toJSON);
		const html = Mustache.render(template, $.extend({}, {
			name: this.user.attributes.name,
			created_at: date,
			login: this.user.attributes.login,
			avatar_url: this.user.attributes.avatar_url,
			has_guild: (this.user.attributes.guild ? true : false) },
			(this.user.attributes.guild ? {
			guild_id: this.user.attributes.guild.id,
			guild_name: this.user.attributes.guild.name,
			guild_role: this.user.attributes.guild_role,
			guild_img: this.user.attributes.img_url,
			contribution: this.user.attributes.contribution,
			} : {})));
		this.$el.html(html);

		return this;
	}
}
