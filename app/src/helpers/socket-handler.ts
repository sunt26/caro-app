import { Socket } from "socket.io-client";
import { GameStore, Player, Result } from "../types";
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
          console.log(ACTION.GAME_STARTED, data.players)
          useGameStore.setState(produce((state: GameStore) => {
            state.startGame = true;
            state.isLoading = false;
            state.players = data.players.map((player: any): Player => ({
              id: player.id,
              name: player.name,
              side: player.side,
              timeLeft: 300000,
            }));
            state.roomId = data.roomId;
          }));
          break;

        case ACTION.GAME_OVER:
          break;

        case ACTION.JOIN_PUBLIC_ROOM:
          console.log(ACTION.JOIN_PUBLIC_ROOM, data.players)
          // if(data.players.length === 2) {
          //   useGameStore.setState(produce((state: GameStore) => {
          //     state.startGame = true;
          //     state.isLoading = false;
          //     state.players = data.players;
          //     state.roomId = data.roomId;
          //   }));
          // }
          break;

        default:
          break;
      }
    });

    this.createPlayer();
  }

  createPlayer() {
    const id = generateID();
    this.emitAction(ACTION.CREATE_PLAYER, { name: id }, id);
  }

  createPrivateRoom() {
    this.emitAction(ACTION.CREATE_PRIVATE_ROOM, { isPublic: false });
  }

  joinPrivateRoom(roomId: string) {
    this.emitAction(ACTION.JOIN_PRIVATE_ROOM, { roomId });
  }

  joinPublicRoom() {
    this.emitAction(ACTION.JOIN_PUBLIC_ROOM, {});
    useGameStore.getState().setIsLoading(true);
  }

  emitAction(action: string, data: any, customPlayerId?: string) {
    console.log("emit", action, data);
    const playerId = customPlayerId || useGameStore.getState().currentUser?.id || generateID();
    this.socket.emit(EVENT.REQUEST, {
      playerId: playerId,
      action,
      data
    });
  }
}