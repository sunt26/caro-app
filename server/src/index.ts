import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerSocketHandlers } from './socket';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // bạn nên cấu hình domain thực tế ở production
  },
});

const rooms = [];
const players = [];

// Đăng ký các event socket.io
io.on('connection', (socket) => {
  console.log(`⚡️ New client connected: ${socket.id}`);
  registerSocketHandlers(io, socket);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
