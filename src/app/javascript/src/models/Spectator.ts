import BaseModel from "src/lib/BaseModel";

export interface ISpectator {
  id: number;
  login: string;
}

export default class Spectator extends BaseModel<ISpectator> {}
