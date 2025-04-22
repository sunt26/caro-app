"use client"

import { useState, useEffect, useRef } from "react"
import { Flag, Clock, Settings, X, MessageCircle, Undo, BotIcon as Robot } from "lucide-react"
import "../styles/game-board.css"
import { Board } from "./Board"
import { Chat } from "./Chat"

// Định nghĩa kiểu dữ liệu
interface Player {
  id: string
  name: string
  avatar: string
  score: number
  isBot?: boolean
  country?: string
}

type CellValue = null | "X" | "O"
type GameStatus = "waiting" | "playing" | "finished" | "draw"

interface GameState {
  board: CellValue[][]
  currentPlayer: "X" | "O"
  status: GameStatus
  winner: "X" | "O" | null
  winningCells: [number, number][]
  moveHistory: { row: number; col: number; player: "X" | "O" }[]
}

export function GameBoard() {
  // Kích thước bàn cờ
  const BOARD_SIZE = 15

  // Thông tin người chơi
  const [players, setPlayers] = useState<{ X: Player; O: Player }>({
    X: {
      id: "player1",
      name: "okok",
      avatar: "/avatar1.png",
      score: 1000,
      country: "vn",
    },
    O: {
      id: "player2",
      name: "Paper Man",
      avatar: "/avatar2.png",
      score: 1000,
      isBot: true,
    },
  })

  // Thời gian còn lại cho mỗi người chơi (giây)
  const [timeLeft, setTimeLeft] = useState<{ X: number; O: number }>({
    X: 300, // 5 phút
    O: 300,
  })

  // Trạng thái game
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null)),
    currentPlayer: "X",
    status: "playing",
    winner: null,
    winningCells: [],
    moveHistory: [],
  })

  // Hiển thị chat
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string }[]>([])
  const [newMessage, setNewMessage] = useState("")

  // Hiệu ứng đếm thời gian
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (gameState.status === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => ({
          ...prev,
          [gameState.currentPlayer]: Math.max(0, prev[gameState.currentPlayer] - 1),
        }))
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState.currentPlayer, gameState.status])

  // Kiểm tra hết thời gian
  useEffect(() => {
    if (timeLeft[gameState.currentPlayer] === 0 && gameState.status === "playing") {
      handleTimeout()
    }
  }, [timeLeft, gameState.currentPlayer, gameState.status])

  // Xử lý hết thời gian
  const handleTimeout = () => {
    const winner = gameState.currentPlayer === "X" ? "O" : "X"
    setGameState((prev) => ({
      ...prev,
      status: "finished",
      winner,
    }))
  }

  // Xử lý đặt quân cờ
  const handleCellClick = (row: number, col: number) => {
    // Nếu ô đã có quân hoặc game đã kết thúc thì không làm gì
    if (gameState.board[row][col] !== null || gameState.status === "finished" || gameState.status === "draw") {
      return
    }

    // Tạo bản sao của bàn cờ và cập nhật
    const newBoard = gameState.board.map((r) => [...r])
    newBoard[row][col] = gameState.currentPlayer

    // Lưu lịch sử nước đi
    const newMoveHistory = [...gameState.moveHistory, { row, col, player: gameState.currentPlayer }]

    // Kiểm tra thắng thua
    const { isWin, winningCells } = checkWinner(newBoard, row, col, gameState.currentPlayer)

    if (isWin) {
      // Cập nhật trạng thái game khi có người thắng
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer,
        status: "finished",
        winner: gameState.currentPlayer,
        winningCells,
        moveHistory: newMoveHistory,
      })
    } else if (newMoveHistory.length === BOARD_SIZE * BOARD_SIZE) {
      // Hòa nếu đã đánh hết bàn cờ
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer,
        status: "draw",
        winner: null,
        winningCells: [],
        moveHistory: newMoveHistory,
      })
    } else {
      // Chuyển lượt nếu game chưa kết thúc
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
        status: "playing",
        winner: null,
        winningCells: [],
        moveHistory: newMoveHistory,
      })
    }
  }

  // Kiểm tra người thắng
  const checkWinner = (
    board: CellValue[][],
    row: number,
    col: number,
    player: "X" | "O",
  ): { isWin: boolean; winningCells: [number, number][] } => {
    const directions = [
      [1, 0], // dọc
      [0, 1], // ngang
      [1, 1], // chéo xuống
      [1, -1], // chéo lên
    ]

    for (const [dx, dy] of directions) {
      let count = 1
      const winCells: [number, number][] = [[row, col]]

      // Kiểm tra theo một hướng
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i
        const newCol = col + dy * i
        if (
          newRow >= 0 &&
          newRow < BOARD_SIZE &&
          newCol >= 0 &&
          newCol < BOARD_SIZE &&
          board[newRow][newCol] === player
        ) {
          count++
          winCells.push([newRow, newCol])
        } else {
          break
        }
      }

      // Kiểm tra theo hướng ngược lại
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i
        const newCol = col - dy * i
        if (
          newRow >= 0 &&
          newRow < BOARD_SIZE &&
          newCol >= 0 &&
          newCol < BOARD_SIZE &&
          board[newRow][newCol] === player
        ) {
          count++
          winCells.push([newRow, newCol])
        } else {
          break
        }
      }

      // Thắng nếu có 5 quân liên tiếp
      if (count >= 5) {
        return { isWin: true, winningCells: winCells }
      }
    }

    return { isWin: false, winningCells: [] }
  }

  // Định dạng thời gian
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Đi lại nước trước đó
  const undoMove = () => {
    if (gameState.moveHistory.length === 0 || gameState.status !== "playing") {
      return
    }

    const newMoveHistory = [...gameState.moveHistory]
    newMoveHistory.pop()

    // Khôi phục bàn cờ
    const newBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null))
    newMoveHistory.forEach((move) => {
      newBoard[move.row][move.col] = move.player
    })

    // Cập nhật trạng thái game
    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
      status: "playing",
      winner: null,
      winningCells: [],
      moveHistory: newMoveHistory,
    })
  }

  // Gửi tin nhắn chat
  const sendMessage = () => {
    if (!newMessage.trim()) return

    setChatMessages([...chatMessages, { sender: players.X.name, message: newMessage }])
    setNewMessage("")
  }

  // Bắt đầu game mới
  const startNewGame = () => {
    setGameState({
      board: Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null)),
      currentPlayer: "X",
      status: "playing",
      winner: null,
      winningCells: [],
      moveHistory: [],
    })
    setTimeLeft({
      X: 300,
      O: 300,
    })
  }

  // Hủy bỏ ván chơi
  const cancelGame = () => {
    if (window.confirm("Bạn có chắc muốn hủy bỏ ván chơi này?")) {
      startNewGame()
    }
  }

  return (
    <div className="caro-game-container">
      {/* Header với thông tin người chơi */}
      <div className="game-header">
        {/* Người chơi X */}
        <div className={`player-info ${gameState.currentPlayer === "X" ? "active" : ""}`}>
          <div className="player-avatar">
            <img src={"https://papergames.io/vi/assets/images/avatars/c2f5609f-b81f-4de4-a544-5eae4d6d9180.svg"} alt="Player X" />
            {players.X.country && (
              <div className="player-country">
                <Flag size={16} />
                <span>{players.X.country}</span>
              </div>
            )}
          </div>
          <div className="player-name">{players.X.name}</div>
          <div className="player-timer">
            <Clock size={16} />
            <span>{formatTime(timeLeft.X)}</span>
          </div>
        </div>

        {/* Người chơi O */}
        <div className={`player-info ${gameState.currentPlayer === "O" ? "active" : ""}`}>
          <div className="player-avatar">
            <img src={"https://papergames.io/vi/assets/images/avatars/0a1b9db1-55e4-422a-9a6e-ddce0b9f2f60.svg"} alt="Player O" />
            {players.O.isBot && (
              <div className="player-bot">
                <Robot size={16} />
              </div>
            )}
          </div>
          <div className="player-name">{players.O.name}</div>
          <div className="player-timer">
            <Clock size={16} />
            <span>{formatTime(timeLeft.O)}</span>
          </div>
        </div>
      </div>

      <div className="game-board-container">
        <Board />
      </div>

      {/* Thông báo kết quả */}
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
      )}

      {/* Footer với các nút điều khiển */}
      <div className="game-footer">
        <button className="cancel-button" onClick={cancelGame}>
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
