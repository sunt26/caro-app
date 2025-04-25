export enum Side {
  BLACK = "black",
  WHITE = "white",
}

export interface Square {
  value?: Side;
  row: number;
  col: number;
}

export interface User {
  id: string;
  name: string;
}

export interface Player extends User {
  side: Side;
  timeLeft: number;
  isBot?: boolean;
};

export type Position = {
  row: number;
  col: number;
};

export type ChatMessage = {
  sender: string;
  message: string;
  timestamp: Date;
};

export type Board = Array<Side | undefined>[];

export type Result = {
  status: ResultStatus;
  data: any;
  message: string;
  action?: string;
}

export enum ResultStatus {
  OK = "OK",
  ERROR = "ERROR",
}