import Game from "src/models/Game";
import { getRandomFloat } from "src/utils";
import Ball from "./classes/Ball";
import Player from "./classes/Player";
import Rect from "./classes/Rect";

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

interface IDifficultyOptions {
  initialBallSpeedMin: number;
  initialBallSpeedMax: number;
  ballSpeedFactor: number;
  paddleSpeedAi: number;
  ballDetectionRange: number;
}

export type Difficulty = "easy" | "normal" | "hard";

export type Mode = "training" | "online";

const DIFFICULTIES: Record<Difficulty, IDifficultyOptions> = {
  easy: {
    initialBallSpeedMin: 300,
    initialBallSpeedMax: 400,
    ballSpeedFactor: 1.05,
    paddleSpeedAi: 250,
    ballDetectionRange: 5,
  },
  normal: {
    initialBallSpeedMin: 400,
    initialBallSpeedMax: 500,
    ballSpeedFactor: 1.1,
    paddleSpeedAi: 275,
    ballDetectionRange: 10,
  },
  hard: {
    initialBallSpeedMin: 500,
    initialBallSpeedMax: 600,
    ballSpeedFactor: 1.15,
    paddleSpeedAi: 500,
    ballDetectionRange: 15,
  },
} as const;

export default class Pong {
  public canvas: HTMLCanvasElement;
  public players: [Player, Player];
  private ctx: CanvasRenderingContext2D;
  private ball: Ball;
  private chars: HTMLCanvasElement[];
  private game: Game;

  constructor(canvas: HTMLCanvasElement, game: Game) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.game = game;

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

  private get AI() {
    return this.players[1];
  }

  private get difficulty() {
    return DIFFICULTIES[this.game.get("level")];
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

    this.moveAI(dt);

    this.players.forEach((player) => this.collide(player, this.ball));

    this.draw();
  }

  reset() {
    this.ball.pos.x = this.canvas.width / 2;
    this.ball.pos.y = this.canvas.height / 2;
    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }

  moveAI(dt: number) {
    if (!this.game.get("isTraining")) {
      return;
    }
    if (
      this.ball.pos.y - this.difficulty.ballDetectionRange > this.AI.top &&
      this.ball.pos.y < this.AI.bottom - this.difficulty.ballDetectionRange
    ) {
    } else if (this.ball.pos.y > this.AI.pos.y) {
      this.AI.pos.y += this.difficulty.paddleSpeedAi * dt;
    } else if (this.ball.pos.y < this.AI.pos.y) {
      this.AI.pos.y -= this.difficulty.paddleSpeedAi * dt;
    }
  }

  start() {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      this.ball.vel.x = getRandomFloat(
        this.difficulty.initialBallSpeedMin,
        this.difficulty.initialBallSpeedMax
      );
      this.ball.vel.y = getRandomFloat(
        this.difficulty.initialBallSpeedMin,
        this.difficulty.initialBallSpeedMax
      );
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
      ball.vel.len = len * this.difficulty.ballSpeedFactor;
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
