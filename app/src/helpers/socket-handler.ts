import { Socket } from "socket.io-client";
import { GameStore, Player, Position, Result } from "../types";
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
      console.log("[RES]", action, data, message, status);

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
            state.players = data.players.map((player: any): Player => ({
              id: player.id,
              name: player.name,
              side: player.side,
              timeLeft: 5 * 60,
            }));
            state.turnId = data.turn;
          }));
          break;

        case ACTION.GAME_OVER:
          useGameStore.setState(produce((state: GameStore) => {
            state.winner = data.game.winner;
          }));
          break;

        case ACTION.TURN_PLAYED:
          useGameStore.setState(produce((state: GameStore) => {
            state.board = data.game.board;
            state.turnId = data.game.turn;
            state.winner = data.game.winner;
          }));
          break;

        case ACTION.JOIN_PUBLIC_ROOM:
          useGameStore.setState(produce((state: GameStore) => {
            state.roomId = data.id;
          }));
          break;

        case ACTION.CREATE_PRIVATE_ROOM:
          useGameStore.setState(produce((state: GameStore) => {
            state.roomId = data.id;
            state.players = data.players.map((player: any): Player => ({
              id: player.id,
              name: player.name,
              side: player.side,
              timeLeft: 5 * 60,
            }))
          }));
          break;

        case ACTION.JOIN_PRIVATE_ROOM:
          if (!data) {
            useGameStore.setState(produce((state: GameStore) => {
              state.roomNotFound = true;
            }));
          } else {
            useGameStore.setState(produce((state: GameStore) => {
              state.roomId = data.id;
              state.players = data.players.map((player: any): Player => ({
                id: player.id,
                name: player.name,
                side: player.side,
                timeLeft: 5 * 60,
              }))
            }));
          }
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
    this.emitAction(ACTION.JOIN_PRIVATE_ROOM, { roomId: `ROOM-${roomId}` });
  }

  joinPublicRoom() {
    this.emitAction(ACTION.JOIN_PUBLIC_ROOM, {});
    useGameStore.getState().setIsLoading(true);
  }

  playTurn(roomId: string, position: Position) {
    this.emitAction(ACTION.TURN_PLAYED, {
      position,
      roomId,
    });
  }

  leaveRoom() {
    this.emitAction(ACTION.LEAVE_ROOM, {
      roomId: useGameStore.getState().roomId
    });
  }

  emitAction(action: string, data: any, customPlayerId?: string) {
    console.log("[REQ]", action, data);
    const playerId = customPlayerId || useGameStore.getState().currentUser?.id || generateID();
    this.socket.emit(EVENT.REQUEST, {
      playerId: playerId,
      action,
      data
    });
  }
}