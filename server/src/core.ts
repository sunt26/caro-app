import { nanoid } from 'nanoid';

export const BOARD_SIZE = 15;
export const WINNING_COUNT = 5;
export class Room {
  id: string;
  players: Player[];
  gameState: any;

  constructor(id: string) {
    this.id = id;
    this.players = [];
    this.gameState = {};
  }

  addPlayer(player: Player) {
    if (this.players.length < 2) {
      this.players.push(player);
      return true;
    }
    return false;
  }

  removePlayer(playerId: string) {
    this.players = this.players.filter((player) => player.id !== playerId);
  }

  isFull() {
    return this.players.length === 2;
  }
}

export class Player {
  id: string;
  roomId: string | null;
  side: Side | null;

  constructor(id: string) {
    this.id = id;
    this.roomId = null;
    this.side = null;
  }

  joinRoom(roomId: string) {
    this.roomId = roomId;
  }

  leaveRoom() {
    this.roomId = null;
  }
}

export class GameState {
  board: string[][];
  players: Player[];
  winner: Player | null;
  turn: string;

  constructor() {
    this.board = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));

    this.players = [];
    this.winner = null;
    this.turn = '';
  }
  playMove(props: { position: Position; playerID: string }) {
    const { position, playerID } = props;
    const player = this.getCurrentPlayer(playerID);
    const opponent = this.getOpponent(playerID);

    if (!player || !opponent) {
      throw new Error('Player not found');
    }

    if (this.board[position.row][position.col] === null) {
      this.board[position.row][position.col] = player.id;
      this.turn = this.turn === player.id ? opponent.id : player.id;
    }

    return {
      position,
      new
    };
  }
  checkWinner(props: { position: Position; playerID: string }) {
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

  isValidPosition(position: Position) {
    return (
      position.row >= 0 &&
      position.row < this.board.length &&
      position.col >= 0 &&
      position.col < this.board[0].length
    );
  }

  getCurrentPlayer(id: string) {
    return this.players.find((player) => player.id === id);
  }

  getOpponent(currentId: string) {
    return this.players.find((p) => p.id !== currentId);
  }
}

export class Engine {
  rooms: Room[];
  players: Player[];

  constructor() {
    this.rooms = [];
    this.players = [];
  }

  createRoom() {
    const roomId = `ROOM-${this.generateID()}`;
    const room = new Room(roomId);
    this.rooms.push(room);
    return room;
  }

  addPlayerToRoom(playerId: string, roomId: string) {
    const player = this.getPlayerByID(playerId);
    const room = this.getRoomByID(roomId);

    if (!player || !room) {
      return false;
    }

    room.addPlayer(player);
    player.joinRoom(roomId);
    return true;
  }

  removePlayerFromRoom(playerId: string, roomId: string) {
    const player = this.getPlayerByID(playerId);
    const room = this.rooms.find((room) => room.id === roomId);

    if (room && player) {
      room.removePlayer(player.id);
      player.leaveRoom();
      if (room.players.length === 0) {
        this.rooms = this.rooms.filter((r) => r.id !== roomId);
      }
      return true;
    }
    return false;
  }

  getPlayerByID(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  getRoomByID(roomId: string) {
    return this.rooms.find((room) => room.id === roomId);
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  generateID() {
    return nanoid().toUpperCase();
  }
}

/* -------------------------------------------------------------------------- */
/*                                NORMAL TYPES                                */
/* -------------------------------------------------------------------------- */
export enum Side {
  BLACK = 'black',
  WHITE = 'white',
}

export type Position = {
  row: number;
  col: number;
};