import { Board, Player, Position, Side, User } from "./core";

export type GameState = {
  currentUser?: User;
  board: Board;
  players: Player[];
  turnId: string;
  roomId?: string;
  winner?: Player;
  isLoading: boolean;
  startGame: boolean;
};

export type GameActions = {
  setRoomId: (id: string) => void;
  setPlayers: (players: Player[]) => void;
  makeMove: (position: Position, symbol: Side) => void;
  setWinner: (winner: Player) => void;
  resetGame: (props?: any) => any;
  setUserName: (name: string) => void;
  setCurrentUser: (user: User) => void;
  setIsLoading: (isLoading: boolean) => void;
  setStartGame: (startGame: boolean) => void;
}

export type GameStore = GameState & GameActions;