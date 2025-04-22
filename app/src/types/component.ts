import { Player } from "./core";

export interface SquareProps {
  row: number;
  col: number;
}

export type MenuItemProps = {
  icon: React.ReactNode;
  text: string;
  number: number;
  subtext?: string;
  highlight?: boolean;
  handler: (props?: any) => any;
}

export type ChatProps = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
}

export type GameHeaderProps = {
  player1: Player;
  player2: Player;
}

export type GamePlayerProps = {
  player1: Player;
  player2: Player;
}