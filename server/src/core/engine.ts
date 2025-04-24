import { Player } from "./player";
import { Room } from "./room";
import { Result } from "./result";
import { MESSAGE } from "../constants";
import { Position } from "../types";
import { Socket } from "socket.io";

export class Engine {
  rooms: Room[];
  players: Player[];
  roomQueue: Room[] = [];

  constructor() {
    this.rooms = [];
    this.players = [];
  }

  createRoom(playerId: string, isPublic: boolean): Result {
    const roomId = `ROOM-${this.generateID()}`;
    const room = new Room(roomId);
    this.rooms.push(room);
    this.joinRoom(playerId, room.id);

    if (isPublic) {
      this.roomQueue.push(room);
    }

    return Result.respond_success({ room }, MESSAGE.SUCCESS);
  }

  joinRoom(playerId: string, roomId: string): Result {
    const player = this.getPlayerByID(playerId);
    if (!player) {
      console.log("player not found")
      return Result.respond_error(null, MESSAGE.PLAYER_NOT_FOUND);
    }

    const room = this.getRoomByID(roomId);
    if (!room) {
      console.log("room not found")
      return Result.respond_error(null, MESSAGE.ROOM_NOT_FOUND);
    }

    room.addPlayer(player);

    return Result.respond_success({
      room,
    });
  }

  joinPublicRoom(playerId: string): Result {
    let room = null;
    if (this.roomQueue.length === 0) {
      room = this.createRoom(playerId, true).data.room;
      console.log("init public", room.id)
    } else {
      room = this.roomQueue.shift() as Room;
      console.log("get exists", room.id)
      this.joinRoom(playerId, room.id);
    }
    console.log(room)
    if(room.isFull()) {
      console.log("start")
      room.startGame();
    }
    return this.joinRoom(playerId, room.id);
  }

  leaveRoom(playerId: string, roomId: string): Result {
    const player = this.getPlayerByID(playerId);
    if (!player) {
      return Result.respond_error(null, MESSAGE.PLAYER_NOT_FOUND);
    }

    const room = this.getRoomByID(roomId);
    if (!room) {
      return Result.respond_error(null, MESSAGE.ROOM_NOT_FOUND);
    }

    return room.removePlayer(playerId);
  }

  playTurn(roomId: string, playerId: string, position: Position): Result {
    const room = this.getRoomByID(roomId);
    if (!room) {
      return Result.respond_error(null, MESSAGE.ROOM_NOT_FOUND);
    }

    return room.playTurn(playerId, position);
  }

  getPlayerByID(playerId: string): Player | undefined {
    return this.players.find((player) => player.id === playerId);
  }

  getRoomByID(roomId: string): Room | undefined {
    return this.rooms.find((room) => room.id === roomId);
  }

  addNewPlayer(playerId: string, name: string, socket: Socket): Result {
    const newPlayer = new Player(playerId, name, socket);
    this.players.push(newPlayer);
    return Result.respond_success({ player: {
      id: newPlayer.id,
      name: newPlayer.name
    } }, MESSAGE.SUCCESS);
  }

  generateID(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }
}