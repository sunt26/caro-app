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
  side?: Side;
  isBot?: boolean;
  timeLeft?: number;
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