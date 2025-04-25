import { BOARD_SIZE, MESSAGE, WINNING_COUNT } from "../constants";
import { Position, Side } from "../types";
import { Player } from "./player";
import { Result } from "./result";

export class Game {
  board: string[][];
  players: Player[];
  winner: Player | null;
  turn: string;

  constructor(players: Player[],) {
    if (players.length !== 2) {
      throw new Error('Game must have 2 players');
    }
    this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    this.winner = null;
    this.players = players;
    const randomTheFirstId = Math.floor(Math.random() * 2);
    this.turn = this.players[randomTheFirstId].id;
    this.players.forEach((player, index) => {
      player.side = index === randomTheFirstId ? Side.WHITE : Side.BLACK;
    });
  }

  playTurn(playerId: string, position: Position): Result {
    if(this.winner){
      throw new Error(MESSAGE.GAME_OVER);
    }

    const player = this.getCurrentPlayer(playerId);
    const opponent = this.getOpponent(playerId);

    if (!player || !opponent) {
      throw new Error(MESSAGE.MISSING_PLAYER);
    }

    if (player.id !== this.turn) {
      throw new Error(MESSAGE.NOT_YOUR_TURN);
    }

    if (!this.isValidPosition(position)) {
      throw new Error("Invalid position");
    }

    if (!this.isEmptyPosition(position)) {
      throw new Error("Position is not empty");
    }

    this.board[position.row][position.col] = player.side as string;
    this.turn = this.turn === player.id ? opponent.id : player.id;

    if (this.checkWinner({ position, playerID: player.id })) {
      this.winner = player;
    }

    return Result.respond_success({ game: this.toObject() }, MESSAGE.SUCCESS);
  }

  playerLeave(playerId: string): Result {
    this.winner = this.players.filter((player) => player.id !== playerId)[0];
    return Result.respond_success({ game: this.toObject() }, MESSAGE.SUCCESS);
  }

  checkWinner(props: { position: Position; playerID: string }): boolean {
    const { position, playerID } = props;
    const player = this.getCurrentPlayer(playerID);
    const directions = [
      { row: 0, col: 1 }, // Horizontal
      { row: 1, col: 0 }, // Vertical
      { row: 1, col: 1 }, // Diagonal \
      { row: 1, col: -1 }, // Diagonal /
    ];

    for (const { row: dy, col: dx } of directions) {
      let count = 1;
      // Check in the positive direction
      for (let i = 1; i < 3; i++) {
        const newRow = position.row + dy * i;
        const newCol = position.col + dx * i;
        if (this.isValidPosition({ row: newRow, col: newCol }) && this.board[newRow][newCol] === this.board[position.row][position.col]) {
          count++;
        } else {
          break;
        }
      }

      // Check in the negative direction
      for (let i = 1; i < 3; i++) {
        const newRow = position.row - dy * i;
        const newCol = position.col - dx * i;
        if (this.isValidPosition({ row: newRow, col: newCol }) && this.board[newRow][newCol] === this.board[position.row][position.col]) {
          count++;
        } else {
          break;
        }
      }

      if (count >= WINNING_COUNT) {
        return true;
      }
    }

    return false;
  }

  isEmptyPosition(position: Position): boolean {
    return this.board[position.row][position.col] === null;
  }

  isValidPosition(position: Position): boolean {
    return (
      position.row >= 0 &&
      position.row < this.board.length &&
      position.col >= 0 &&
      position.col < this.board[0].length
    );
  }

  getCurrentPlayer(id: string): Player | undefined {
    return this.players.find((player) => player.id === id);
  }

  getOpponent(currentId: string): Player | undefined {
    return this.players.find((p) => p.id !== currentId);
  }

  toObject() {
    return {
      winner: this.winner?.toObject(),
      turn: this.turn,
      players: this.players.map((player) => player.toObject()),
      board: this.board,
    }
  }
}