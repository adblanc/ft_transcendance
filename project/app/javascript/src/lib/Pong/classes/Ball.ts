import Rect from "./Rect";
import Vec from "./Vec";

export default class Ball extends Rect {
  vel: Vec;

  constructor() {
    super(10, 10);

    this.vel = new Vec();
  }
}
