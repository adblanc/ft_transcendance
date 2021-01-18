import Rect from "./Rect";

export default class Player extends Rect {
  score: number;

  constructor() {
    super(20, 100);

    this.score = 0;
  }
}
