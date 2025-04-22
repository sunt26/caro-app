import { Board, Player, Position, Side, User } from "./core";

export type GameState = {
  currentUser: User;
  board: Board;
  players: Player[];
  turn?: string;
  roomId?: string;
  winner?: Player;
};

export type GameActions = {
  setRoomId: (id: string) => void;
  setPlayers: (players: Player[]) => void;
  makeMove: (position: Position, symbol: Side) => void;
  setWinner: (winner: Player) => void;
  resetGame: (props?: any) => any;
  setUserName: (name: string) => void;
}

export type GameStore = GameState & GameActions;