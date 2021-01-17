import Backbone from "backbone";
import Mustache from "mustache";
import BaseView from "src/lib/BaseView";
import Game from "src/models/Game";

type Options = Backbone.ViewOptions<Game> & {
  gameId: string;
};

const CHARS = [
  "111101101101111",
  "010010010010010",
  "111001111100111",
  "111001111001111",
  "101101111001001",
  "111100111001111",
  "111100111101111",
  "111001001001001",
  "111101111101111",
  "111101111001111",
];

const CHAR_PIXEL = 10;

class Vec {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set len(value: number) {
    const fact = value / this.len;

    this.x *= fact;
    this.y *= fact;
  }
}

class Rect {
  pos: Vec;
  size: Vec;

  constructor(w: number, h: number) {
    this.pos = new Vec();
    this.size = new Vec(w, h);
  }

  get left() {
    return this.pos.x - this.size.x / 2;
  }

  get right() {
    return this.pos.x + this.size.x / 2;
  }

  get top() {
    return this.pos.y - this.size.y / 2;
  }

  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect {
  vel: Vec;

  constructor() {
    super(10, 10);

    this.vel = new Vec();
  }
}

class Pong {
  public canvas: HTMLCanvasElement;
  public players: [Player, Player];
  private ctx: CanvasRenderingContext2D;
  private ball: Ball;
  private chars: HTMLCanvasElement[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.ball = new Ball();

    this.reset();

    this.players = [new Player(), new Player()];

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this.canvas.width - 40;

    this.players.forEach((player) => (player.pos.y = this.canvas.height / 2));

    let lastTime;

    const callback = (ms: number) => {
      if (lastTime) {
        this.update((ms - lastTime) / 1000);
      }
      lastTime = ms;
      requestAnimationFrame(callback);
    };

    callback(undefined);

    this.chars = CHARS.map((str) => {
      const canvas = document.createElement("canvas");

      canvas.height = CHAR_PIXEL * 5;
      canvas.width = CHAR_PIXEL * 3;
      const context = canvas.getContext("2d");

      context.fillStyle = "#fff";
      str.split("").forEach((fill, i) => {
        if (fill === "1") {
          context.fillRect(
            (i % 3) * CHAR_PIXEL,
            ((i / 3) | 0) * CHAR_PIXEL,
            CHAR_PIXEL,
            CHAR_PIXEL
          );
        }
      });
      return canvas;
    });
  }

  update(dt: number) {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
      let winnerId = this.ball.vel.x < 0 ? 1 : 0;

      this.players[winnerId].score++;
      this.reset();
    }

    if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }

    this.players[1].pos.y = this.ball.pos.y;

    this.players.forEach((player) => this.collide(player, this.ball));

    this.draw();
  }

  reset() {
    this.ball.pos.x = this.canvas.width / 2;
    this.ball.pos.y = this.canvas.height / 2;
    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }

  start() {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      this.ball.vel.x = 300 * (Math.random() > 0.5 ? 1 : -1);
      this.ball.vel.y = 300 * (Math.random() * 2 - 1);
      this.ball.vel.len = 200;
    }
  }

  collide(player: Player, ball: Ball) {
    if (
      player.left < ball.right &&
      player.right > ball.left &&
      player.top < ball.bottom &&
      player.bottom > ball.top
    ) {
      const len = ball.vel.len;
      ball.vel.x = -ball.vel.x;

      ball.vel.y += 300 * (Math.random() - 0.5);
      ball.vel.len = len * 1.05;
    }
  }

  draw() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawRect(this.ball);
    this.players.forEach((player) => this.drawRect(player));

    this.drawScore();
  }

  drawRect(rect: Rect) {
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }

  drawScore() {
    const align = this.canvas.width / 3;
    const CHAR_WIDTH = CHAR_PIXEL * 4;
    this.players.forEach((player, i) => {
      const chars = player.score.toString().split("");
      const offset =
        align * (i + 1) - (CHAR_WIDTH * chars.length) / 2 + CHAR_PIXEL / 2;

      chars.forEach((char, pos) => {
        this.ctx.drawImage(
          this.chars[(char as unknown) as number | 0],
          offset + pos * CHAR_WIDTH,
          20
        );
      });
    });
  }
}

class Player extends Rect {
  score: number;

  constructor() {
    super(20, 100);

    this.score = 0;
  }
}

export default class GameView extends BaseView<Game> {
  pong: Pong | undefined;

  constructor(options: Options) {
    super(options);

    this.model = new Game({ id: parseInt(options.gameId) });

    this.model.fetch({ error: this.onFetchError });

    this.pong = undefined;
  }

  events() {
    return {
      "mousemove #pong": this.onMouseMove,
      "click #pong": this.onClick,
    };
  }

  onFetchError() {
    Backbone.history.navigate("/not-found", { trigger: true });
  }

  onMouseMove(e: JQuery.MouseMoveEvent) {
    if (this.pong) {
      const scale = e.offsetY / e.target.getBoundingClientRect().height;

      this.pong.players[0].pos.y = this.pong.canvas.height * scale;
    }
  }

  onClick(e: JQuery.ClickEvent) {
    if (this.pong) {
      this.pong.start();
    }
  }

  render() {
    const template = $("#playGameTemplate").html();
    const html = Mustache.render(template, this.model.toJSON());
    this.$el.html(html);

    const canvas = this.$("#pong")[0] as HTMLCanvasElement;

    this.pong = new Pong(canvas);

    return this;
  }
}
