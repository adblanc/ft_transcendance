import Backbone from "backbone";
import _ from "underscore";
import { currentUser } from "src/models/Profile";
import { syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";
import consumer from "channels/consumer";
import { displaySuccess, displayError } from "src/utils/toast";
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
  status?: "pending" | "started" | "finished" | "unanswered";
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
  event: "started" | "expired";

  payload: any;

  action: "player_movement" | "player_score" | "game_over";
  playerId: number;
}

export interface MovementData extends GameData {
  posY: number;
}

type CreatableGameArgs = Partial<Pick<IGame, "goal" | "level" | "game_type">>;

type ConstructorArgs = Pick<IGame, "id" | "isTraining">;

export default class Game extends BaseModel<IGame> {
  first: Number;
  channel: ActionCable.Channel;
  spectatorsChannel?: ActionCable.Channel;

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

  sync(method: string, model: Game, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createGame(attrs: CreatableGameArgs) {
    return this.asyncSave(attrs, { url: this.urlRoot() });
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
          //console.log("game received", data);
          this.onScoreReceived(data);
          this.onMovementReceived(data);
          this.onGameStarted(data);
          this.onGameExpired(data);
          this.onGameOver(data);
        },
        disconnected: () => {
          console.log("disconnected from the game", gameId);
        },
      }
    );
  }

  onScoreReceived(data: GameData) {
    if (data.action === "player_score") {
      console.log("player scored", data);
      eventBus.trigger("pong:player_scored", data);
    }
  }

  onMovementReceived(data: GameData) {
    if (
      data.action === "player_movement" &&
      data.playerId !== currentUser().get("id")
    ) {
      eventBus.trigger("pong:player_movement", data);
    }
  }

  onGameStarted(data: GameData) {
    if (data.event === "started") {
      console.log("we navigate");
      this.navigateToGame();
      return this.unsubscribeChannelConsumer();
    }
  }

  onGameExpired(data: GameData) {
    if (data.event == "expired") {
      currentUser().fetch();
      if (this.get("game_type") != "war_time") {
        displayError(
          "We were not able to find an opponent. Please try different game settings."
        );
      } else if (this.get("game_type") == "chat") {
        eventBus.trigger("chatplay:change");
      } else {
        displaySuccess(
          "No one answered your War Time challenge! You have won the match."
        );
      }
      return this.unsubscribeChannelConsumer();
    }
  }

  onGameOver(data: GameData) {
    if (data.action === "game_over") {
      console.log(data, "game_oveeeeeeeeer");

      const winner = this.get("players").find(
        (p) => p.get("id") === data.payload.winnerId
      );
      const looser = this.get("players").find(
        (p) => p.get("id") === data.payload.looserId
      );

      winner?.set({ status: "won" });
      looser?.set({ status: "lose" });

      this.set({ status: "finished" });
    }
  }

  navigateToGame() {
    Backbone.history.navigate(`/game/${this.get("id")}`, {
      trigger: true,
    });
  }

  challenge(level: string, goal: number, game_type: string, warTimeId: string) {
    return this.asyncSave(
      {
        level: level,
        goal: goal,
        game_type: game_type,
        warTimeId: warTimeId,
      },
      {
        url: `${this.urlRoot()}/challenge`,
      }
    );
  }

  acceptChallenge() {
    return this.asyncSave(
      {},
      {
        url: `${this.baseGameRoot()}/acceptChallenge`,
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
}
