import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { ACTION, EVENT } from '../constants';
import { Result } from '../types';
import { produce } from 'immer';

type SocketStore = {
  socket: Socket | null;
  isReady: boolean;
  initSocket: () => void;
  disconnectSocket: () => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  isReady: false,

  initSocket: () => {
    const socketInstance = io("http://192.168.191.128:3000", {
      autoConnect: false,
    });
    socketInstance.connect();

    socketInstance.on(EVENT.RESPONSE, (result: Result) => {
      const { data, message, status, action } = result;

      switch (action) {
        case ACTION.CREATE_PLAYER:
          alert("Player created");
          set(produce((state: SocketStore) => {
            state.isReady = true;
          }));
          break;

        default:
          break;
      }
    });

    set({ socket: socketInstance });
  },

  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));

export 