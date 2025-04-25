import { Server, Socket } from 'socket.io';
import { Engine } from './core/engine';
import { ACTION, EVENT, MESSAGE } from './constants';
import { Payload } from './core/payload';
import { Result, SocketResult } from './core/result';

export function registerSocketHandlers(engine: Engine, io: Server, socket: Socket) {
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

  socket.on(EVENT.REQUEST, (payload: Payload) => {
    const { playerId, action, data } = payload;
    let result: SocketResult = SocketResult.respond_error(action, null);;

    try {
      switch (action) {
        case ACTION.CREATE_PLAYER:
          result = engine.addNewPlayer(playerId, data.name, socket);
          break;
  
        case ACTION.CREATE_PRIVATE_ROOM:
          result = engine.createPrivateRoom(playerId);
          break;
  
        case ACTION.JOIN_PUBLIC_ROOM:
          result = engine.joinPublicRoom(playerId);
          break;
  
        case ACTION.JOIN_PRIVATE_ROOM:
          result = engine.joinPrivateRoom(playerId, data.roomId);
          break;
  
        case ACTION.TURN_PLAYED:
          result = engine.playTurn(data.roomId, playerId, data.position);
          break;
  
        case ACTION.LEAVE_ROOM:
          result = engine.leaveRoom(playerId, data.roomId);
          break;
  
        default:
          break;
      }
  
      console.log(`[${result.action}] ${JSON.stringify(result.data)}`);
    } catch (error: any) {
      console.log(`[ERROR][${action}] ${error.message}`);
      result.message = error.message;
    }

    socket.emit(EVENT.RESPONSE, result);
  });
}
