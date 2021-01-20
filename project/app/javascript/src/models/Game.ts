import Backbone from "backbone";
import _ from "underscore";
import Profile, { currentUser } from "src/models/Profile";
import Profiles from "src/collections/Profiles";
import { syncWithFormData } from "src/utils";
import BaseModel from "src/lib/BaseModel";
import { BASE_ROOT } from "src/constants";
import consumer from "channels/consumer";
import { displaySuccess, displayError } from "src/utils/toast";
import { eventBus } from "src/events/EventBus";
import WarTime from "./WarTime";
import Spectators from "src/collections/Spectators";
import Spectator, { ISpectator } from "./Spectator";

interface IGame {
  id: number;
  level?: string;
  goal?: number;
  status?: "pending" | "started" | "finished" | "unanswered";
  game_type?: string;
  isSpectator?: boolean;
  users?: Profiles;
  spectators?: Spectators;
  war_time?: WarTime;
}

export interface GameData {
  event: "started" | "expired";

  payload: any;

  action: "player_movement";
  playerId: number;
}

interface SpectatorData {
  action: "spectator_joined" | "spectator_left";
  payload: ISpectator;
}

export interface MovementData extends GameData {
  posY: number;
}

type CreatableGameArgs = Partial<Pick<IGame, "goal" | "level" | "game_type">>;

type ConstructorArgs = Pick<IGame, "id">;

export default class Game extends BaseModel<IGame> {
  first: Number;
  channel: ActionCable.Channel;
  spectatorsChannel?: ActionCable.Channel;

  preinitialize() {
    this.relations = [
      {
        type: Backbone.Many,
        key: "users",
        collectionType: Profiles,
        relatedModel: Profile,
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
      users: [],
      spectators: [],
    };
  }

  urlRoot = () => `${BASE_ROOT}/games`;
  baseGameRoot = () => `${this.urlRoot()}/${this.get("id")}`;

  sync(method: string, model: Game, options: JQueryAjaxSettings): any {
    return syncWithFormData(method, model, options);
  }

  createGame(attrs: CreatableGameArgs) {
    return this.asyncSave(attrs, { url: this.urlRoot() });
  }

  score(user_id: string) {
    return this.asyncSave(user_id, { url: this.baseGameRoot() });
  }

  connectToWS() {
    this.createChannelConsumer();
    this.connectToSpectatorsChannel();
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
          if (this.get("isSpectator")) {
            console.log("on send new_spectator");
            this.channel.perform("new_spectator", {
              payload: {
                id: currentUser().get("id"),
                login: currentUser().get("login"),
              },
            });
          }
        },
        received: (data: GameData) => {
          console.log("game received", data);
          this.onMovementReceived(data);
          this.onGameStarted(data);
          this.onGameExpired(data);
        },
        disconnected: () => {
          console.log("disconnected to the game", gameId);
        },
      }
    );
  }

  connectToSpectatorsChannel() {
    this.unsubscribeSpectatorsChannel();
    this.spectatorsChannel = consumer.subscriptions.create(
      { channel: "GameSpectatorsChannel", id: this.get("id") },
      {
        connected: () => {
          console.log("connected to spectators", this.get("id"));
        },
        received: ({ action, payload }: SpectatorData) => {
          console.log("received", action, payload);
          if (
            action === "spectator_joined" &&
            !this.get("spectators").find((s) => s.get("id") === payload.id)
          ) {
            this.get("spectators").push(new Spectator(payload));
          } else if (action === "spectator_left") {
            const spectator = this.get("spectators").find(
              (s) => s.get("id") === payload.id
            );

            if (spectator) {
              this.get("spectators").remove(spectator);
            }
          }
        },
      }
    );
  }

  unsubscribeSpectatorsChannel() {
    this.spectatorsChannel?.unsubscribe();
    this.spectatorsChannel = undefined;
  }

  onMovementReceived(data: GameData) {
    if (
      data.action === "player_movement" &&
      data.playerId !== currentUser().get("id")
    ) {
      console.log("received other player data", data);
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
      } else {
        displaySuccess(
          "No one answered your War Time challenge! You have won the match."
        );
      }
      return this.unsubscribeChannelConsumer();
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
}
