import { useShallow } from "zustand/shallow";
import { useGameStore } from "../stores/useGameStore";
import { GameStore } from "../types";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RoomPage = () => {
  // const [name, setName] = useState("");
  const { } = useGameStore(useShallow((state: GameStore) => {
    return {
      currentUser: state.currentUser,
      roomId: state.roomId,
    }
  }));
  const navigate = useNavigate();

  return (
    <div className="caro-game-container">
      <div className="content-wrapper">
        <button className="back-button" onClick={() => { navigate("/") }}>
          <ArrowLeft className="back-icon" />
          <span>Back to menu</span>
        </button>
        <div className="content-card">
          <h1 className="page-title">Phòng chơi</h1>
          <p className="page-description">Nhập ID phòng</p>
          <div className="input-container">
            <input onChange={(e) => { }} autoFocus type="text" />
          </div>
          <div className="button-container" style={{ marginTop: "20px" }}>
            <button
              className="primary-button"
              onClick={() => {
                // setUserName(name || currentUser.id);
              }}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}