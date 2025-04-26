import { useState, useEffect, useRef } from "react"
import { Flag, Clock, MessageCircle, BotIcon as Robot } from "lucide-react"
import { Board } from "../components/Board"
import "../styles/game-board.css"
import { useGameStore } from "../stores/useGameStore"
import { useShallow } from "zustand/shallow"
import { GameUsers } from "../components/GameUsers"
import { useSocketStore } from "../stores/useSocketStore"
import { Loading } from "../components/Loading"
import { SocketHandler } from "../helpers/socket-handler"
import { useNavigate } from "react-router-dom"

export function GamePage() {
  const navigate = useNavigate();
  const { handler } = useSocketStore(useShallow(state => ({
    handler: state.handler as SocketHandler,
  })));

  const { isLoading, startGame, winner, currentUser, roomNotFound, roomId } = useGameStore(useShallow(state => ({
    winner: state.winner,
    isLoading: state.isLoading,
    startGame: state.startGame,
    currentUser: state.currentUser,
    roomNotFound: state.roomNotFound,
    roomId: state.roomId,
  })));

  useEffect(() => {
    if (roomNotFound) {
      alert("Room not found");
      navigate("/");
    }
  }, [roomNotFound]);

  useEffect(() => {
    window.onbeforeunload = () => {
      handler?.leaveRoom();
    }
  }, [handler]);

  if (!handler) {
    return <div className="error-message">Something error</div>
  }

  if (isLoading) {
    return <Loading isLoading title="Finding your opponent..." />
  }

  if (!startGame) {
    return <Loading isLoading title={`ROOM ID: ${roomId?.split("-")[1]} - Game not start...`} />
  }

  return (
    <div className="caro-game-container">
      <div className="game-header">
        <GameUsers />
      </div>

      <div className="game-board-container">
        <Board />
      </div>

      {winner && (
        <div className="game-result">
          <div className="result-content">
            <h2>{winner.id === currentUser?.id ? "You win" : "You lose"}</h2>
            <button className="primary-button" onClick={() => {
              window.location.reload();
            }}>
              Quit
            </button>
          </div>
        </div>
      )}

      <div className="game-footer">
        <button className="cancel-button" onClick={() => {
          handler?.leaveRoom();
          window.location.reload();
        }} title="Hủy bỏ ván chơi">
          <span>Cancel</span>
        </button>
      </div>
    </div>
  )
}
