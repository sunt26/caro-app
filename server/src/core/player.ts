import { Socket } from "socket.io";
import { MESSAGE } from "../constants";
import { Side } from "../types";
import { Result } from "./result";

export class Player {
  id: string;
  name: string;
  side: Side | null;
  socket: Socket;

  constructor(id: string, name: string, socket: Socket) {
    this.id = id;
    this.name = id;
    this.side = null;
    this.socket = socket;
  }

  toObject() {
    return ({
      id: this.id,
      name: this.name,
      side: this.side
    });
  }
}