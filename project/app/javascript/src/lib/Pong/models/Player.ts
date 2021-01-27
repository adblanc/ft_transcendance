import BaseModel from "src/lib/BaseModel";
import Paddle from "../classes/Paddle";

interface IPlayer {
  id: number;
  name: string;
  points: number;
}

export default class Player extends BaseModel<IPlayer> {
  private _paddle: Paddle;

  initialize() {
    this._paddle = new Paddle();
  }

  get paddle() {
    return this._paddle;
  }

  get posX() {
    return this._paddle.pos.x;
  }

  get posY() {
    return this._paddle.pos.y;
  }

  set posX(value: number) {
    this._paddle.pos.x = value;
  }

  set posY(value: number) {
    this._paddle.pos.y = value;
  }

  score() {
    this.set({ points: this.get("points") + 1 });
    console.log("score");
  }
}
