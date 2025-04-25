import { MESSAGE } from "../constants";
import { Position } from "../types";
import { Game } from "./game";
import { Player } from "./player";
import { Result } from "./result";

export class Room {
  id: string;
  players: Player[];
  game: Game | null;
  isPublic: boolean;

  constructor(id: string, isPublic = true) {
    this.id = id;
    this.players = [];
    this.game = null;
    this.isPublic = isPublic;
  }

  startGame(): Result {
    this.game = new Game(this.players);
    return Result.respond_success({ room: this.toObject() }, MESSAGE.SUCCESS);
  }

  playTurn(playerId: string, position: Position): Result {
    if (!this.game) {
      throw new Error(MESSAGE.MISSING_GAME);
    }

    if (!this.checkPlayerJoined(playerId)) {
      throw new Error(MESSAGE.PLAYER_NOT_FOUND);
    }

    return this.game.playTurn(playerId, position);
  }

  addPlayer(player: Player): Result {
    if (this.players.length > 2 || this.checkPlayerJoined(player.id)) {
      throw new Error(MESSAGE.CAN_NOT_JOIN_ROOM);
    }
    
    this.players.push(player);

    if (this.players.length === 2) {
      this.startGame();
    }

    return Result.respond_success({ room: this.toObject() }, MESSAGE.SUCCESS);
  }

  checkPlayerJoined(playerId: string): boolean {
    return this.players.some((player) => player.id === playerId);
  }

  removePlayer(playerId: string): Result {
    this.players = this.players.filter((player) => player.id !== playerId);
    this.game?.playerLeave(playerId);
    return Result.respond_success({ room: this.toObject() }, MESSAGE.SUCCESS);
  }

  isFull(): boolean {
    return this.players.length === 2;
  }

  emitEvent(event: string, data: any) {
    this.players.forEach((player) => {
      player.socket.emit(event, data);
    });
  }

  toObject() {
    return ({
      id: this.id,
      players: this.players.map((player) => player.toObject()),
      game: this.game?.toObject(),
    });
  }
}
