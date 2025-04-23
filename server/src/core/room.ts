import { MESSAGE } from "../constants";
import { Position } from "../types";
import { Game } from "./game";
import { Player } from "./player";
import { Result } from "./result";

export class Room {
  id: string;
  players: Player[];
  game: Game | null;

  constructor(id: string) {
    this.id = id;
    this.players = [];
    this.game = null;
  }

  startGame(): Result {
    try {
      this.game = new Game(this.players);
    } catch (error) {
      return Result.respond_error(null, MESSAGE.MISSING_PLAYER);
    }
    return Result.respond_success({ room: this }, MESSAGE.SUCCESS);
  }

  playTurn(playerId: string, position: Position): Result {
    if (!this.game) {
      return Result.respond_error(null, MESSAGE.MISSING_GAME);
    }

    return this.game.playTurn(playerId, position);
  }

  addPlayer(player: Player): Result {
    if (this.players.length > 2 || player.roomId) {
      return Result.respond_error(null, MESSAGE.CAN_NOT_JOIN_ROOM);
    }
    player.joinRoom(this.id);
    this.players.push(player);
    return Result.respond_success({ room: this }, MESSAGE.SUCCESS);
  }

  removePlayer(playerId: string): Result {
    this.players.find((player) => player.id === playerId)?.leaveRoom();
    this.players = this.players.filter((player) => player.id !== playerId);
    return Result.respond_success({ room: this }, MESSAGE.SUCCESS);
  }

  isFull(): boolean {
    return this.players.length === 2;
  }

  emitEvent(event: string, data: any) {
    this.players.forEach((player) => {
      player.socket.emit(event, data);
    });
  }
}
