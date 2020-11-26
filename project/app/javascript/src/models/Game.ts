import Backbone from "backbone";
import _ from "underscore";
import Profile from "./Profile";

interface IGame
{
    Id: number;
    Type: string;
    Points: number;
    user: Profile;
    url: string;
}

export default class Game extends Backbone.Model<IGame>
{
   urlRoot = () => "http://localhost:3000/game";
   user = new Profile(); 
    Points: number;
    Type: string;
    
    // constructor(Id: number, type: string, Pts: number, Profil: Profile) {
    //     super();
    //     this.set(this.Type: type);
    //     this.user = Profil;
    //     this.Points = Pts;
    //     this.url = this.urlRoot;
    //     console.log(this.id);
    // }
    constructor(options?: any)
    {
        super(options);
    }
    defaults() {
 	return {
 		Type: 'blabla',
 		Points: 0,
 	};  }
   
    createGame() {}
    // set sName(nom: string)
    // {
    //     this.set('name', nom);
    // }
    get gType(): string
     {
         return this.get('Type');
     }
}