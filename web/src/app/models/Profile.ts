import Backbone from "backbone";

interface IProfile {
    login: string;
    name: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
}

export default class Profile extends Backbone.Model<IProfile> {
    constructor(options?: IProfile) {
        super(options);
    }

    urlRoot = () => "http://localhost:5000/user";
}
