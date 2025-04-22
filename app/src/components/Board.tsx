import { APP } from "../constants"
import { Square } from "./Square"

export const Board = () => {
  return (
    <div className="board">
      {Array.from({ length: APP.BOARD.ROW_SIZE }, (_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array.from({ length: APP.BOARD.COL_SIZE }, (_, colIndex) => (
            <Square key={colIndex} col={colIndex} row={rowIndex} />
          ))}
        </div>
      ))}
    </div>
  )
}