import { useState } from "react"
import { useGameStore } from "../stores/useGameStore";
import { useShallow } from "zustand/shallow";

export const WelcomePage = () => {
  const [name, setName] = useState("");
  const { currentUser, setUserName } = useGameStore(useShallow(state => {
    return {
      currentUser: state.currentUser,
      setUserName: state.setUserName,
    }
  }));

  return (
    <div className="caro-game-container">
      <div className="content-wrapper">
        <div className="content-card">
          <h1 className="page-title">Before you start</h1>
          <p className="page-description">Give us your name and start the game</p>
          <div className="input-container">
            <input onChange={(e) => setName(e.target.value)} value={name} autoFocus type="text" />
          </div>
          <div className="button-container" style={{ marginTop: "20px" }}>
            <button
              className="primary-button"
              onClick={() => {
                setUserName(name || currentUser.id);
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