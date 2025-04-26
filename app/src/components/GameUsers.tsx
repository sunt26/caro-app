import { useShallow } from "zustand/shallow";
import { useGameStore } from "../stores/useGameStore";
import { Clock, BotIcon as Robot } from "lucide-react";
import { formatTime } from "../helpers";
import { useEffect } from "react";
import { GameStore } from "../types";
import { current, produce } from "immer";

export const GameUsers = () => {
  const { players, turnId, currentUser } = useGameStore(useShallow(state => {
    return {
      players: state.players,
      turnId: state.turnId,
      currentUser: state.currentUser,
    }
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      useGameStore.setState(produce((state: GameStore) => {
        const turnPlayer = state.players.find(player => player.id == turnId);
        if (turnPlayer) {
          turnPlayer.timeLeft -= 1;
        }
        return state;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [turnId]);

  return (
    players.map((player, index) => (
      <div key={index} className={`player-info ${player.id === turnId ? "active" : ""}`}>
        <div className="player-avatar">
          <img src={"https://papergames.io/vi/assets/images/avatars/c2f5609f-b81f-4de4-a544-5eae4d6d9180.svg"} alt={`Player ${index}`} />
          {player.isBot && (
            <div className="player-bot">
              <Robot size={16} />
            </div>
          )}
        </div>
        <div className="player-name">{player.name + (player.id === currentUser?.id ? " (You)" : "")}</div>
        <div className="player-timer">
          <Clock size={16} />
          <span>{formatTime(player.timeLeft || 0)}</span>
        </div>
      </div>
    ))
  );
}