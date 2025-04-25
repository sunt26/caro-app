import { useShallow } from "zustand/shallow";
import { useGameStore } from "../stores/useGameStore";
import { Clock, BotIcon as Robot } from "lucide-react";
import { formatTime } from "../helpers";
import { useEffect } from "react";
import { GameStore } from "../types";
import { produce } from "immer";

export const GameUsers = () => {
  const { currentUser, players, turnId } = useGameStore(useShallow(state => {
    return {
      currentUser: state.currentUser,
      players: state.players,
      turnId: state.
    }
  }));

  const turnPlayer = players.find(player => player.id === turnId);

  useEffect(()=>{
    const interval = setInterval(() => {
      turnPlayer?.timeLeft -= 1000;
      useGameStore.setState(produce((state: GameStore) => {
        state.players.forEach(player => {
          
        })
      }))
    }, 1000);
    return () => clearInterval(interval);
  }, [turnId]);

  return (
    players.map((player, index) => (
      <div key={index} className={`player-info ${player.id === currentUser?.id ? "active" : ""}`}>
        <div className="player-avatar">
          <img src={"https://papergames.io/vi/assets/images/avatars/c2f5609f-b81f-4de4-a544-5eae4d6d9180.svg"} alt={`Player ${index}`} />
          {player.isBot && (
            <div className="player-bot">
              <Robot size={16} />
            </div>
          )}
        </div>
        <div className="player-name">{player.name}</div>
        <div className="player-timer">
          <Clock size={16} />
          <span>{formatTime(player.timeLeft || 0)}</span>
        </div>
      </div>
    ))
  );
}