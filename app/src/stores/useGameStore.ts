import { create } from 'zustand';
import { GameStore, Player, Side } from '../types/index';
import { produce } from 'immer';
import { initBoard, initCurrentUser, initPlayer } from '../helpers';

export const useGameStore = create<GameStore>((set) => ({
  currentUser: initCurrentUser(),
  players: [initPlayer(initCurrentUser()), initPlayer(initCurrentUser())],
  board: initBoard(),
  roomId: undefined,
  winner: undefined,

  setRoomId: (id) => {
    set(produce((state: GameStore) => {
      state.roomId = id;
    }));
  },
  setPlayers: (players) => {
    set(produce((state: GameStore) => {
      state.players = players;
    }));
  },
  makeMove: (position, side) =>
    set(
      produce((state: GameStore) => {
        if (!state.board[position.row][position.col]) {
          state.board[position.row][position.col] = side;
        }
      })
    ),
  setWinner: (winner: Player) => {
    set(
      produce((state: GameStore) => {
        state.winner = winner;
      })
    );
  },
  setUserName: (name: string) => {
    set(
      produce((state: GameStore) => {
        state.currentUser.name = name;
      })
    );
  },
  resetGame: () =>
    set({
      board: Array(15).fill(undefined).map(() => Array(15).fill(undefined)),
      winner: undefined,
    }),
}));
