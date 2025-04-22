export const GameHeader = () => {
  return (
    <div>
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
      )
}