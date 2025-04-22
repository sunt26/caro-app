import { useState, useEffect, useRef } from "react"
import { Flag, Clock, MessageCircle, BotIcon as Robot } from "lucide-react"
import { Board } from "../components/Board"
import { Chat } from "../components/Chat"
import "../styles/game-board.css"
import { APP } from "../constants"
import { formatTime } from "../helpers"
import { useGameStore } from "../stores/useGameStore"
import { useShallow } from "zustand/shallow"
import { GameUsers } from "../components/GameUsers"

interface Player {
  id: string
  name: string
  avatar: string
  score: number
  isBot?: boolean
  country?: string
}


export function GamePage() {
  const { players, roomId } = useGameStore(useShallow(state => {
    return {
      currentUser: state.currentUser,
      players: state.players,
      board: state.board,
      roomId: state.roomId,
      winner: state.winner,
    }
  }));

  const [showChat, setShowChat] = useState(false)
  const timerRef = useRef<number | null>(null)

  // useEffect(() => {
  //   if (gameState.status === "playing") {
  //     timerRef.current = setInterval(() => {
  //       setTimeLeft((prev) => ({
  //         ...prev,
  //         [gameState.currentPlayer]: Math.max(0, prev[gameState.currentPlayer] - 1),
  //       }))
  //     }, 1000)
  //   }

  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current)
  //     }
  //   }
  // }, [gameState.currentPlayer, gameState.status])

  // // Kiểm tra hết thời gian
  // useEffect(() => {
  //   if (timeLeft[gameState.currentPlayer] === 0 && gameState.status === "playing") {
  //     handleTimeout()
  //   }
  // }, [timeLeft, gameState.currentPlayer, gameState.status])

  // // Xử lý hết thời gian
  // const handleTimeout = () => {
  //   const winner = gameState.currentPlayer === "X" ? "O" : "X"
  //   setGameState((prev) => ({
  //     ...prev,
  //     status: "finished",
  //     winner,
  //   }))
  // }

  // const handleCellClick = (row: number, col: number) => {
  //   // Nếu ô đã có quân hoặc game đã kết thúc thì không làm gì
  //   if (gameState.board[row][col] !== null || gameState.status === "finished" || gameState.status === "draw") {
  //     return
  //   }

  //   // Tạo bản sao của bàn cờ và cập nhật
  //   const newBoard = gameState.board.map((r) => [...r])
  //   newBoard[row][col] = gameState.currentPlayer

  //   // Lưu lịch sử nước đi
  //   const newMoveHistory = [...gameState.moveHistory, { row, col, player: gameState.currentPlayer }]

  //   // Kiểm tra thắng thua
  //   const { isWin, winningCells } = checkWinner(newBoard, row, col, gameState.currentPlayer)

  //   if (isWin) {
  //     // Cập nhật trạng thái game khi có người thắng
  //     setGameState({
  //       board: newBoard,
  //       currentPlayer: gameState.currentPlayer,
  //       status: "finished",
  //       winner: gameState.currentPlayer,
  //       winningCells,
  //       moveHistory: newMoveHistory,
  //     })
  //   } else if (newMoveHistory.length === BOARD_SIZE * BOARD_SIZE) {
  //     // Hòa nếu đã đánh hết bàn cờ
  //     setGameState({
  //       board: newBoard,
  //       currentPlayer: gameState.currentPlayer,
  //       status: "draw",
  //       winner: null,
  //       winningCells: [],
  //       moveHistory: newMoveHistory,
  //     })
  //   } else {
  //     // Chuyển lượt nếu game chưa kết thúc
  //     setGameState({
  //       board: newBoard,
  //       currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
  //       status: "playing",
  //       winner: null,
  //       winningCells: [],
  //       moveHistory: newMoveHistory,
  //     })
  //   }
  // }

  // Kiểm tra người thắng
  // const checkWinner = (
  //   board: CellValue[][],
  //   row: number,
  //   col: number,
  //   player: "X" | "O",
  // ): { isWin: boolean; winningCells: [number, number][] } => {
  //   const directions = [
  //     [1, 0], // dọc
  //     [0, 1], // ngang
  //     [1, 1], // chéo xuống
  //     [1, -1], // chéo lên
  //   ]

  //   for (const [dx, dy] of directions) {
  //     let count = 1
  //     const winCells: [number, number][] = [[row, col]]

  //     // Kiểm tra theo một hướng
  //     for (let i = 1; i < 5; i++) {
  //       const newRow = row + dx * i
  //       const newCol = col + dy * i
  //       if (
  //         newRow >= 0 &&
  //         newRow < BOARD_SIZE &&
  //         newCol >= 0 &&
  //         newCol < BOARD_SIZE &&
  //         board[newRow][newCol] === player
  //       ) {
  //         count++
  //         winCells.push([newRow, newCol])
  //       } else {
  //         break
  //       }
  //     }

  //     // Kiểm tra theo hướng ngược lại
  //     for (let i = 1; i < 5; i++) {
  //       const newRow = row - dx * i
  //       const newCol = col - dy * i
  //       if (
  //         newRow >= 0 &&
  //         newRow < BOARD_SIZE &&
  //         newCol >= 0 &&
  //         newCol < BOARD_SIZE &&
  //         board[newRow][newCol] === player
  //       ) {
  //         count++
  //         winCells.push([newRow, newCol])
  //       } else {
  //         break
  //       }
  //     }

  //     // Thắng nếu có 5 quân liên tiếp
  //     if (count >= 5) {
  //       return { isWin: true, winningCells: winCells }
  //     }
  //   }

  //   return { isWin: false, winningCells: [] }
  // }


  // Đi lại nước trước đó
  // const undoMove = () => {
  //   if (gameState.moveHistory.length === 0 || gameState.status !== "playing") {
  //     return
  //   }

  //   const newMoveHistory = [...gameState.moveHistory]
  //   newMoveHistory.pop()

  //   // Khôi phục bàn cờ
  //   const newBoard = Array(BOARD_SIZE)
  //     .fill(null)
  //     .map(() => Array(BOARD_SIZE).fill(null))
  //   newMoveHistory.forEach((move) => {
  //     newBoard[move.row][move.col] = move.player
  //   })

  //   // Cập nhật trạng thái game
  //   setGameState({
  //     board: newBoard,
  //     currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
  //     status: "playing",
  //     winner: null,
  //     winningCells: [],
  //     moveHistory: newMoveHistory,
  //   })
  // }

  // Gửi tin nhắn chat
  // const sendMessage = () => {
  //   if (!newMessage.trim()) return

  //   setChatMessages([...chatMessages, { sender: players.X.name, message: newMessage }])
  //   setNewMessage("")
  // }

  // // Bắt đầu game mới
  // const startNewGame = () => {
  //   setGameState({
  //     board: Array(BOARD_SIZE)
  //       .fill(null)
  //       .map(() => Array(BOARD_SIZE).fill(null)),
  //     currentPlayer: "X",
  //     status: "playing",
  //     winner: null,
  //     winningCells: [],
  //     moveHistory: [],
  //   })
  //   setTimeLeft({
  //     X: 300,
  //     O: 300,
  //   })
  // }

  // // Hủy bỏ ván chơi
  // const cancelGame = () => {
  //   if (window.confirm("Bạn có chắc muốn hủy bỏ ván chơi này?")) {
  //     startNewGame()
  //   }
  // }

  if (!roomId) {
    return <div className="error-message">Không tìm thấy phòng chơi</div>
  }

  if (players.length < 2) {
    return <div className="error-message">Chưa có đủ người chơi</div>
  }

  return (
    <div className="caro-game-container">
      {/* Header với thông tin người chơi */}
      <div className="game-header">
        <GameUsers />
      </div>

      <div className="game-board-container">
        <Board />
      </div>

      {/* Thông báo kết quả
      {(gameState.status === "finished" || gameState.status === "draw") && (
        <div className="game-result">
          <div className="result-content">
            {gameState.status === "draw" ? (
              <h2>Hòa!</h2>
            ) : (
              <h2>{gameState.winner === "X" ? players.X.name : players.O.name} thắng!</h2>
            )}
            <button className="primary-button" onClick={startNewGame}>
              Chơi lại
            </button>
          </div>
        </div>
      )} */}

      {/* Footer với các nút điều khiển */}
      <div className="game-footer">
        <button className="cancel-button" onClick={() => {}} title="Hủy bỏ ván chơi">
          <span>Hủy bỏ ván chơi</span>
        </button>
        <button
          className={`control-button ${showChat ? "active" : ""}`}
          onClick={() => setShowChat(!showChat)}
          title="Chat"
        >
          <MessageCircle size={20} />
        </button>
      </div>

      {/* Chat panel */}
      {showChat && <Chat setShowChat={setShowChat} showChat={showChat} />}
    </div>
  )
}
