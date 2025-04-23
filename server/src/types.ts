export enum Side {
  BLACK = 'black',
  WHITE = 'white',
}

export enum ResultStatus {
  OK = "OK",
  ERROR = "ERROR",
}

export type Position = {
  row: number;
  col: number;
};