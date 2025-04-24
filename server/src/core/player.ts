import { Socket } from "socket.io";
import { MESSAGE } from "../constants";
import { Side } from "../types";
import { Result } from "./result";

export class Player {
  id: string;
  name: string;
  roomId: string | null;
  side: Side | null;
  socket: Socket;

  constructor(id: string, name: string, socket: Socket) {
    this.id = id;
    this.name = name || `Player ${id}`;
    this.roomId = null;
    this.side = null;
    this.socket = socket;
  }

  joinRoom(roomId: string): Result {
    this.roomId = roomId;
    return Result.respond_success({ player: this }, MESSAGE.SUCCESS);
  }

  leaveRoom() {
    this.roomId = null;
    return Result.respond_success({ player: this }, MESSAGE.SUCCESS);
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      side: this.side
    }
  }
}