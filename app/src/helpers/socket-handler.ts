import { Socket } from "socket.io-client";
import { GameStore, Result } from "../types";
import { ACTION, EVENT } from "../constants";
import { useGameStore } from "../stores/useGameStore";
import { generateID } from ".";
import { produce } from "immer";

export class SocketHandler {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  init() {
    this.socket.on(EVENT.RESPONSE, (result: Result) => {
      const { data, message, status, action } = result;

      switch (action) {
        case ACTION.CREATE_PLAYER:
          useGameStore.getState().setCurrentUser({
            id: data.player.id,
            name: data.player.name,
          });
          break;

        case ACTION.GAME_STARTED:
          useGameStore.setState(produce((state: GameStore) => {
            state.startGame = true;
            state.isLoading = false;
            state.players = data.players;
            state.roomId = data.roomId;
          }));
          break;

        case ACTION.GAME_OVER:
          break;

        default:
          break;
      }
    });

    this.createPlayer();
  }

  createPlayer() {
    const id = generateID();
    this.emitAction(ACTION.CREATE_PLAYER, { id, name: id });
  }

  createRoom() {
    this.emitAction(ACTION.CREATE_ROOM, { isPublic: false });
  }

  findRoom(roomId: string) {
    this.emitAction(ACTION.FIND_ROOM, { roomId });
  }

  findPublicRoom() {
    this.emitAction(ACTION.FIND_RANDOM_ROOM, {});
    useGameStore.getState().setIsLoading(true);
  }

  emitAction(action: string, data: any) {
    console.log("emit", action, data);
    this.socket.emit(EVENT.REQUEST, {
      playerId: useGameStore.getState().currentUser?.id,
      action,
      data
    });
  }
}