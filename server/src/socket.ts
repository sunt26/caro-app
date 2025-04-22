import { Server, Socket } from 'socket.io';

export function registerSocketHandlers(io: Server, socket: Socket) {
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit('player-joined', socket.id);
  });

  socket.on('play', ({ roomId, x, y }) => {
    socket.to(roomId).emit('opponent-played', { x, y });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
}
