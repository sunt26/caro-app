import React from "react";
import { useShallow } from "zustand/shallow";
import { useGameStore } from "../stores/useGameStore";
import { Side, SquareProps } from "../types";
import { useSocketStore } from "../stores/useSocketStore";

export const Square = React.memo((props: SquareProps) => {
  const { row, col } = props;
  const { square, roomId, currentUser, turnId } = useGameStore(useShallow(state => ({
    square: state.board[row][col],
    roomId: state.roomId,
    currentUser: state.currentUser,
    turnId: state.turnId,
  })));
  const { handler } = useSocketStore(useShallow(state => ({
    handler: state.handler
  })));

  const handleClick = () => {
    handler?.playTurn(roomId || "", { row, col });
  }

  return (
    <div className={`square ${currentUser?.id == turnId ? 'hover-square' : ''}`} onClick={handleClick}>
      {square && <div className={`chess chess-${square == Side.BLACK ? 'black' : 'white'}`}></div>}
    </div>
  )
});