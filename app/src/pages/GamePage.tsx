import { useState, useEffect, useRef } from "react"
import { Flag, Clock, MessageCircle, BotIcon as Robot } from "lucide-react"
import { Board } from "../components/Board"
import "../styles/game-board.css"
import { useGameStore } from "../stores/useGameStore"
import { useShallow } from "zustand/shallow"
import { GameUsers } from "../components/GameUsers"
import { useSocketStore } from "../stores/useSocketStore"
import { Loading } from "../components/Loading"

interface Player {
  id: string
  name: string
  avatar: string
  score: number
  isBot?: boolean
  country?: string
}


export function GamePage() {
  const { handler } = useSocketStore(useShallow(state => ({
    handler: state.handler,
  })));

  const { players, roomId, isLoading, startGame } = useGameStore(useShallow(state => ({
    currentUser: state.currentUser,
    players: state.players,
    board: state.board,
    roomId: state.roomId,
    winner: state.winner,
    isLoading: state.isLoading,
    startGame: state.startGame,
  })));

  console.log(players, roomId, isLoading, startGame);

  const [showChat, setShowChat] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // handler?.emit("joinRoom", roomId);
    // return () => {
    //   handler?.emit("leaveRoom", roomId);
    // }
  }, [roomId]);

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

  if (!handler) {
    return <div className="error-message">Something error</div>
  }

  if(isLoading) {
    return <Loading isLoading title="Finding your opponent..." />
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
        <button className="cancel-button" onClick={() => { }} title="Hủy bỏ ván chơi">
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
    </div>
  )
}
