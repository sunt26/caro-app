import { create } from 'zustand';
import { GameStore, Player, Side } from '../types/index';
import { produce } from 'immer';
import { initBoard, initCurrentUser, initPlayer } from '../helpers';

export const useGameStore = create<GameStore>((set) => ({
  currentUser: undefined,
  players: [initPlayer(initCurrentUser()), initPlayer(initCurrentUser())],
  board: initBoard(),
  roomId: undefined,
  winner: undefined,
  isLoading: false,
  startGame: false,


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
  setCurrentUser: (user: Player) => {
    set(produce((state: GameStore) => {
      state.currentUser = user;
    }));
  },
  setIsLoading(isLoading) {
    set(produce((state: GameStore) => {
      state.isLoading = isLoading;
    }));
  },
  setStartGame(startGame) {
    set(produce((state: GameStore) => {
      state.startGame = startGame;
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
        if (state.currentUser) {
          state.currentUser.name = name;
        }
      })
    );
  },
  resetGame: () =>
    set({
      board: Array(15).fill(undefined).map(() => Array(15).fill(undefined)),
      winner: undefined,
    }),
}));
