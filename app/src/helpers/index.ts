import { nanoid } from "nanoid"
import { Board, Player, User } from "../types"
import { APP } from "../constants"

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export const initCurrentUser = (): User => {
  const id = generateID();
  return {
    id,
    name: "",
  }
}

// export const initPlayer = (user: User): Player => {
//   return {
//     ...user,
//     side: undefined,
//     isBot: false,
//     timeLeft: APP.TIME_LIMIT, // 5 minutes
//   }
// }

export const initBoard = (): Board => {
  return Array(APP.BOARD.ROW_SIZE)
    .fill(undefined)
    .map(() => Array(APP.BOARD.COL_SIZE).fill(undefined));
}

export const generateID = () => {
  return nanoid(8).toUpperCase();
}

export const generateRoomID = () => {
  return nanoid(4).toUpperCase();
}