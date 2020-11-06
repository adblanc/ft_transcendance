import Backbone from "backbone";

interface IProfile {
    login: string;
    name: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
}

export default class Profile extends Backbone.Model<IProfile> {
    urlRoot = () => "http://localhost:5000/user";

    validate(attrs?: IProfile) {
        if (attrs?.name && attrs.name.length < 3) {
            return "name is too short (minimum length is 3)";
        }

        return null;
    }
}
