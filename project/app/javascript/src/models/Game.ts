import Backbone from "backbone";
import _ from "underscore";
import { currentUser } from "src/models/Profile";
import { syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";
import consumer from "channels/consumer";
import { displayError } from "src/utils/toast";
import { eventBus } from "src/events/EventBus";
import WarTime from "./WarTime";
import Spectators from "src/collections/Spectators";
import Spectator from "./Spectator";
import Players from "src/lib/Pong/collections/Players";
import Player from "src/lib/Pong/models/Player";

interface IGame {
  id: number;
  level?: string;
  goal?: number;
  status?: "pending" | "started" | "finished" | "unanswered" | "paused";
  last_pause?: number;
  pause_duration?: number;
  game_type?: string;
  isSpectator?: boolean;
  isHost?: boolean;
  players?: Players;
  spectators?: Spectators;
  war_time?: WarTime;
  created_at?: string;
  updated_at?: string;
  isTraining?: boolean;
}

export interface GameData {
  payload: any;

  action:
    | "started"
    | "expired"
    | "player_movement"
    | "player_score"
    | "game_over"
    | "game_paused"
    | "game_continue";
  playerId: number;
}

export interface MovementData extends GameData {
  posY: number;
}

type CreatableGameArgs = Partial<Pick<IGame, "goal" | "level" | "game_type">>;

type ConstructorArgs = Pick<IGame, "id" | "isTraining">;

export default class Game extends BaseModel<IGame> {
  channel: ActionCable.Channel;
  spectatorsChannel?: ActionCable.Channel;
  private _timerInterval: any;

  preinitialize() {
    this.relations = [
      {
        type: Backbone.Many,
        key: "players",
        collectionType: Players,
        relatedModel: Player,
      },
      {
        type: Backbone.Many,
        key: "spectators",
        collectionType: Spectators,
        relatedModel: Spectator,
      },
      {
        type: Backbone.One,
        key: "war_time",
        relatedModel: WarTime,
      },
    ];
  }

  constructor(options?: ConstructorArgs) {
    super(options);
  }

  defaults() {
    return {
      players: [],
      spectators: [],
      level: "easy",
    };
  }

  urlRoot = () => `${BASE_ROOT}/games`;
  baseGameRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  get winner() {
    return this.get("players").find((p) => p.get("status") === "won");
  }

  get looser() {
    return this.get("players").find((p) => p.get("status") === "lose");
  }

  get paused() {
    return this.get("status") === "paused";
  }

  sync(method: string, model: Game, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createFriendly(attrs: CreatableGameArgs) {
    return this.asyncSave(attrs, { url: `${this.urlRoot()}/createFriendly` });
  }

  connectToWS() {
    this.createChannelConsumer();
    this.get("spectators").connectToSpectatorsChannel(this.get("id"));
  }

  unsubscribeChannelConsumer() {
    this.channel?.unsubscribe();
    this.channel = undefined;
  }

  createChannelConsumer() {
    this.unsubscribeChannelConsumer();
    const gameId = this.get("id");

    this.channel = consumer.subscriptions.create(
      { channel: "GamingChannel", id: gameId },
      {
        connected: () => {
          console.log("connected to the game", gameId);
        },
        received: (data: GameData) => {
          switch (data.action) {
            case "started":
              this.onGameStarted();
              break;
            case "expired":
              this.onGameExpired();
              break;
            case "game_paused":
              this.onGamePaused(data);
              break;
            case "game_continue":
              this.onGameContinue();
              break;
            case "player_movement":
              this.onPlayerMovement(data);
              break;
            case "player_score":
              this.onPlayerScore(data);
              break;
            case "game_over":
              this.onGameOver(data);
              break;
          }
        },
        disconnected: () => {
          console.log("disconnected from the game", gameId);
        },
      }
    );
  }

  onGameStarted() {
    this.navigateToGame();
    this.unsubscribeChannelConsumer();
  }

  onGameExpired() {
    if (this.get("game_type") == "friendly") {
      displayError(
        "We were not able to find an opponent. Please try different game settings."
      );
      currentUser().fetch(); //car pas de notif envoyée ni d'event
    }
    this.unsubscribeChannelConsumer();
  }

  onGamePaused(data: GameData) {
    console.log("paused", data);
    this.set({ status: "paused", ...data.payload }, { silent: true });
    this.startPauseTimer();
  }

  startPauseTimer() {
    console.log("start pause timer");
    this._timerInterval = setInterval(() => {
      if (this.get("pause_duration") <= 0) {
        return clearInterval(this._timerInterval);
      }
      this.set(
        { pause_duration: this.get("pause_duration") - 1 },
        { silent: true }
      );
    }, 1000);
  }

  onGameContinue() {
    clearInterval(this._timerInterval);
    this.set({ status: "started" }, { silent: true });
  }

  onPlayerMovement(data: GameData) {
    if (data.playerId !== currentUser().get("id")) {
      eventBus.trigger("pong:player_movement", data);
    }
  }

  onPlayerScore(data: GameData) {
    eventBus.trigger("pong:player_scored", data);
  }

  onGameOver(data: GameData) {
    const winner = this.get("players").find(
      (p) => p.get("id") === data.payload.winner.id
    );
    const looser = this.get("players").find(
      (p) => p.get("id") === data.payload.looser.id
    );

    winner?.set(data.payload.winner);
    looser?.set(data.payload.looser);

    this.set({ status: "finished" });
  }

  navigateToGame() {
    Backbone.history.navigate(`/game/${this.get("id")}`, {
      trigger: true,
    });
  }

  challengeWT(
    level: string,
    goal: number,
    game_type: string,
    warTimeId: string
  ) {
    return this.asyncSave(
      {
        level: level,
        goal: goal,
        game_type: game_type,
        warTimeId: warTimeId,
      },
      {
        url: `${this.urlRoot()}/challengeWT`,
      }
    );
  }

  acceptChallengeWT() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGameRoot()}/acceptChallengeWT`,
      }
    );
  }

  playChat(level: string, goal: number, room_id: number) {
    return this.asyncSave(
      {
        level: level,
        goal: goal,
        room_id: room_id,
      },
      {
        url: `${this.urlRoot()}/playChat`,
      }
    );
  }

  acceptPlayChat() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGameRoot()}/acceptPlayChat`,
      }
    );
  }

  ladderChallenge(opponent_id: number) {
    return this.asyncSave(
      {
        opponent_id: opponent_id,
      },
      {
        url: `${this.urlRoot()}/ladderChallenge`,
      }
    );
  }

  acceptLadderChallenge() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGameRoot()}/acceptLadderChallenge`,
      }
    );
  }
}
