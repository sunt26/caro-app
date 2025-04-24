import { Server, Socket } from 'socket.io';
import { Engine } from './core/engine';
import { ACTION, EVENT, MESSAGE } from './constants';
import { Payload } from './core/payload';
import { Result } from './core/result';

export function registerSocketHandlers(engine: Engine, io: Server, socket: Socket) {
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on(EVENT.REQUEST, (payload: Payload) => {
    const { playerId, action, data } = payload;
    let result: Result = Result.respond_success(null, MESSAGE.SUCCESS);
    let actionResponse = action;
    let skipResponse = false;

    switch (action) {
      case ACTION.CREATE_PLAYER:
        result = engine.addNewPlayer(playerId, data.name, socket);
        break;

      case ACTION.FIND_RANDOM_ROOM:
        result = engine.joinPublicRoom(playerId);
        skipResponse = true;
        break;

      case ACTION.FIND_ROOM:
        result = engine.joinRoom(playerId, data.roomId);
        skipResponse = true;
        break;

      case ACTION.CREATE_ROOM:
          result = engine.createRoom(playerId, data.isPublic);
          break;

      case ACTION.TURN_PLAYED:
        result = engine.playTurn(data.roomId, playerId, data.position);
        break;

      default:
        break;
    }

    if(!skipResponse){
      result.action = actionResponse;
      console.log("result", result)
      socket.emit(EVENT.RESPONSE, result);
    }
  });
}
