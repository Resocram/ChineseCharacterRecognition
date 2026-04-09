import React from "react";

export default function GameOver({ sessionMap, onPlayAgain }) {
    const players = Object.values(sessionMap).filter(p => p.username);
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const mySessionId = sessionMap.mySessionId;
    
    return (
        <div className="multiplayer-container">
            <header className="header">
                <h1>Game Over!</h1>
                <p>Final Results</p>
            </header>

            <div className="game-over-card">
                <div className="leaderboard">
                    {sortedPlayers.map((player, index) => (
                        <div key={index} className={`leaderboard-item ${index === 0 ? 'first-place' : ''}`}>
                            <div className="rank">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </div>
                            <div className="player-info">
                                <div className="player-color" style={{ backgroundColor: player.colour }}></div>
                                <span className="player-name">{player.username}</span>
                                {player.username === sessionMap[mySessionId]?.username && <span className="you-badge">You</span>}
                            </div>
                            <div className="player-score">{player.score || 0}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="game-over-actions">
                <button className="lobby-btn primary" onClick={onPlayAgain}>
                    Play Again
                </button>
            </div>
        </div>
    );
}
