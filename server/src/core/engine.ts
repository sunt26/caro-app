import { Player } from "./player";
import { Room } from "./room";
import { Result, SocketResult } from "./result";
import { ACTION, MESSAGE } from "../constants";
import { Position } from "../types";
import { Socket } from "socket.io";

export class Engine {
  rooms: Room[];
  players: Player[];
  publicRoomQueue: Room[] = [];

  constructor() {
    this.rooms = [];
    this.players = [];
  }

  private createRoom(playerId: string, isPublic: boolean): Room {
    const roomId = `ROOM-${this.generateID()}`;
    const room = new Room(roomId, isPublic);
    this.rooms.push(room);
    this.joinRoom(playerId, room.id);

    if (isPublic) {
      this.publicRoomQueue.push(room);
    }

    return room;
  }

  private joinRoom(playerId: string, roomId: string): Room {
    const player = this.getPlayerByID(playerId);
    if (!player) {
      throw new Error(MESSAGE.PLAYER_NOT_FOUND);
    }

    const room = this.getRoomByID(roomId);
    if (!room) {
      throw new Error(MESSAGE.ROOM_NOT_FOUND);
    }

    room.addPlayer(player);
    return room;
  }

  joinPublicRoom(playerId: string): SocketResult {
    if (this.publicRoomQueue.length === 0) {
      return SocketResult.respond_success(ACTION.JOIN_PUBLIC_ROOM, this.createRoom(playerId, true).toObject());
    }
      
    const room = this.publicRoomQueue.shift() as Room;
    console.log("joinRoom", room.players.length);

    try {
      this.joinRoom(playerId, room.id);
    } catch (error) {
      this.publicRoomQueue.unshift(room);
    }
    console.log(" afterjoinRoom", room.players.length);
    return SocketResult.respond_success(ACTION.JOIN_PUBLIC_ROOM, room.toObject());
  }

  joinPrivateRoom(playerId: string, roomId: string): SocketResult {
    const room = this.joinRoom(playerId, roomId);
    return SocketResult.respond_success(ACTION.JOIN_PUBLIC_ROOM, room.toObject());
  }

  createPrivateRoom(playerId: string): SocketResult {
    const room = this.createRoom(playerId, false);
    return SocketResult.respond_success(ACTION.CREATE_PRIVATE_ROOM, room.toObject());
  }

  leaveRoom(playerId: string, roomId: string): SocketResult {
    const room = this.getRoomByID(roomId);
    if (!room) {
      throw new Error(MESSAGE.ROOM_NOT_FOUND);
    }

    return SocketResult.fromResult(ACTION.LEAVE_ROOM, room.removePlayer(playerId));
  }

  playTurn(roomId: string, playerId: string, position: Position): SocketResult {
    const room = this.getRoomByID(roomId);
    if (!room) {
      throw new Error(MESSAGE.ROOM_NOT_FOUND);
    }

    return SocketResult.fromResult(ACTION.TURN_PLAYED, room.playTurn(playerId, position));
  }

  getPlayerByID(playerId: string): Player | undefined {
    return this.players.find((player) => player.id === playerId);
  }

  getRoomByID(roomId: string): Room | undefined {
    return this.rooms.find((room) => room.id === roomId);
  }

  addNewPlayer(playerId: string, name: string, socket: Socket): SocketResult {
    const newPlayer = new Player(playerId, name, socket);
    this.players.push(newPlayer);
    return SocketResult.respond_success(ACTION.CREATE_PLAYER, { player: newPlayer.toObject() }, MESSAGE.SUCCESS);
  }

  generateID(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }
}