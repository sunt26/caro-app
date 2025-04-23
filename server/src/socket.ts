import { Server, Socket } from 'socket.io';
import { Engine } from './core/engine';
import { ACTION, EVENT, MESSAGE } from './constants';
import { Payload } from './core/payload';
import { Result } from './core/result';

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
    let result: Result = Result.respond_success(null, MESSAGE.SUCCESS);
    let actionResponse = action;

    switch (action) {
      case ACTION.CREATE_PLAYER:
        result = engine.addNewPlayer(playerId, data.name, socket);
        break;

      case ACTION.CREATE_ROOM:
        result = engine.createRoom(data.playerId, data.isPublic);
        break;

      case ACTION.FIND_RANDOM_ROOM:
        result = engine.joinPublicRoom(data.playerId);
        actionResponse = ACTION.GAME_STARTED;
        break;

      case ACTION.FIND_ROOM:
        result = engine.joinRoom(data.playerId, data.roomId);
        actionResponse = ACTION.GAME_STARTED;
        break;

      case ACTION.TURN_PLAYED:
        result = engine.playTurn(data.roomId, data.playerId, data.position);
        break;

      default:
        break;
    }

    result.action = actionResponse;
    socket.emit(EVENT.RESPONSE, result);
  });
}
