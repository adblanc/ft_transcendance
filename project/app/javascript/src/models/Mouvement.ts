import Backbone from "backbone";
import { BASE_ROOT } from "src/constants";

export interface IMouvement {
  scale: number;
  game_id: number;
//  sent?: boolean;
  id?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export default class Mouvement extends Backbone.Model<IMouvement> {
  url = () => `${BASE_ROOT}/game_mouv`;
}