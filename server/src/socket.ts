import { Server, Socket } from 'socket.io';
import { Engine } from './core/engine';
import { ACTION, EVENT, MESSAGE } from './constants';
import { Payload } from './core/payload';
import { Result, SocketResult } from './core/result';

export function registerSocketHandlers(engine: Engine, io: Server, socket: Socket) {
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on(EVENT.REQUEST, (payload: Payload) => {
    const { playerId, action, data } = payload;
    let result: SocketResult = SocketResult.respond_error(action, null);;
    let skipResponse = false;

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
          skipResponse = true;
          break;
  
        case ACTION.LEAVE_ROOM:
          result = engine.leaveRoom(playerId, data.roomId);
          skipResponse = true;
          break;
  
        default:
          break;
      }
  
      console.log(`[${result.action}] ${JSON.stringify(result.data)}`);
    } catch (error: any) {
      console.log(`[ERROR][${action}] ${error.message}`);
      result.message = error.message;
    }

    if(!skipResponse){
      socket.emit(EVENT.RESPONSE, result);
    }
  });
}
