import { useShallow } from "zustand/shallow";
import { useGameStore } from "../stores/useGameStore";
import { SquareProps } from "../types";

export const Square = (props: SquareProps) => {
  const { row, col } = props;
  const { square } = useGameStore(useShallow(state => ({
    square: state.board[row][col],
  })));

  return (
    <div className="square">
      {/* <div className="chess"> */}
      {/* </div> */}
    </div>
  )
}