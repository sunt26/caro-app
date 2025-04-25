import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { SocketHandler } from '../helpers/socket-handler';

type SocketStore = {
  socket: Socket | null;
  handler: SocketHandler | null;
  initSocket: () => void;
  disconnectSocket: () => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  handler: null,

  initSocket: () => {
    const socketInstance = io("http://localhost:3000", {
      autoConnect: false,
    });
    socketInstance.connect();

    const sockerHandler = new SocketHandler(socketInstance);
    sockerHandler.init();

    set({
      socket: socketInstance,
      handler: sockerHandler,
    });
  },

  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));