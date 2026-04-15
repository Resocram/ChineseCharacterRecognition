import React, { Component } from "react";
import SettingsModal from "../Components/SettingsModal";

import Multiplayer_Game from "./Multiplayer_Game"
import GameOver from "./GameOver"
import Cookies from 'js-cookie';

const { v4: uuidv4 } = require('uuid');
const PRE_LOBBY = "PRE_LOBBY";
const LOBBY = "LOBBY";
const PLAY = "PLAY";
const GAME_OVER = "GAME_OVER"

const WSS_BACKEND_URL = "wss://chinesecharacterrecognitionbackend.onrender.com"
const HTTPS_BACKEND_URL = "https://chinesecharacterrecognitionbackend.onrender.com"

// const WSS_BACKEND_URL = "wss://chinese-server-0947b7b24ff4.herokuapp.com"
// const HTTPS_BACKEND_URL = "https://chinese-server-0947b7b24ff4.herokuapp.com"

// const WSS_BACKEND_URL = "ws://localhost:5000"
// const HTTPS_BACKEND_URL = "http://localhost:5000"


class RoomIdPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: window.location.hash.substring(2).split('/').pop(), // Initialize roomId from props
      username: Cookies.get('username') || '', // Retrieve username from cookie
      sessionId: Cookies.get('sessionId') || '',
      ws: null,
      position: 0,
      gameState: PRE_LOBBY,
      difficulty: [0, 1000],
      problems: [],
      sessionMap: {},
      round: 0,
      prevAnswers: [],
      showSettings: false,
      skipVotes: { skipped: 0, total: 0 }
    };
  }

  async componentDidMount() {

    let sessionId = Cookies.get('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      Cookies.set('sessionId', sessionId)
    }
    this.setState({ sessionId: sessionId })
    this.initializeWebSocket()
  }
  initializeWebSocket() {
    const ws = new WebSocket(`${WSS_BACKEND_URL}/${this.state.roomId}/${Cookies.get('sessionId')}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update_players') {
        this.setState({ sessionMap: JSON.parse(data.sessions), position: data.position });
      }
      else if (data.type === 'start_game') {
        this.setState({ gameState: PLAY, problems: data.problems, round: data.round })
        Cookies.set(`gameState_${this.state.roomId}`, PLAY)
      }
      else if (data.type === 'update_strokes') {

        this.setState((prevState) => {
          const nestedMap = prevState.sessionMap[data.sessionId];
          if (nestedMap) {
            nestedMap["strokes"] = data.strokes
          }
          return { sessionMap: prevState.sessionMap };
        });
      }
      else if (data.type === 'update_round') {
        if (data.gameOver) {
          this.setState((prevState) => ({ 
            sessionMap: JSON.parse(data.sessions), 
            gameState: GAME_OVER,
            skipVotes: { skipped: 0, total: 0 }
          }));
        } else {
          this.setState((prevState) => ({ 
            sessionMap: JSON.parse(data.sessions), 
            round: data.round,
            prevAnswers: [...prevState.prevAnswers, { answer: this.state.problems[(prevState.round - 1)], colour:  data.correct_player ? data.correct_player.colour : null }],
            skipVotes: { skipped: 0, total: 0 }
          }));
        }

      }
      else if (data.type === 'update_skip_votes') {
        this.setState({ skipVotes: { skipped: data.skippedCount, total: data.totalCount } });
      } else if (data.type === 'init_state') {
        this.setState({
          difficulty: [data.game.difficultyStart, data.game.difficultyEnd],
          sessionMap: data.game.sessions,
          round: data.game.round,
          problems: data.game.problems,
          gameState: data.game.state,
          position: data.position
        });
      }
    };

    ws.onopen = () => {
      let username = this.state.username;
      if (!username) {
        while (!username || username.trim() === '') {
          username = prompt('Enter your username:');
        }
        this.setState({ username: username })
        Cookies.set('username', username)
      }
      this.updatePlayer(username)
    }
    this.setState({ ws: ws })
  }


  updatePlayer = (username) => {
    const updatePlayer = {
      type: 'update_player',
      username: username,
    };
    this.state.ws.send(JSON.stringify(updatePlayer));
  }


  startGame = () => {
    const startGame = {
      type: 'start_game',
      difficulty: this.state.difficulty
    };
    this.state.ws.send(JSON.stringify(startGame));
  }

  sendStrokes = (strokes) => {
    const sendStrokes = {
      type: 'send_strokes',
      strokes: strokes
    };
    this.state.ws.send(JSON.stringify(sendStrokes));
  };

  correctGuess = () => {
    const correctGuessType = {
      type: 'correct_guess',
    };
    this.state.ws.send(JSON.stringify(correctGuessType));
  };

  voteNext = () => {
    const voteNextType = {
      type: 'vote_next',
    };
    this.state.ws.send(JSON.stringify(voteNextType));
  };


  componentWillUnmount() {
    if (this.state.ws) {
      this.state.ws.close();
    }
  }

  updateUsername = () => {
    let newUsername = ''
    while (newUsername.trim() === '') {
      newUsername = prompt('Enter your username:');
      if (newUsername === null) {
        break;
      }
    }
    // If they click the cancel button
    if (newUsername !== null) {
      Cookies.set('username', newUsername);
      this.updatePlayer(newUsername)
    }

  };

  handleCopyClick = () => {
    const roomUrl = `${window.location.origin}${window.location.pathname}#/room/${this.state.roomId}`;

    // Create a temporary element to copy the text
    const tempInput = document.createElement('input');
    tempInput.value = roomUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

  };

  handlePlayAgain = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  setDifficulty = (newDifficulty) => {
    this.setState({
      difficulty: newDifficulty,
    })
  }

  openSettings = () => {
    this.setState({ showSettings: true });
  }

  closeSettings = () => {
    this.setState({ showSettings: false });
  }

  resetButton = () => {
    this.setState(() => ({
      difficulty: [0, 2500],
    }));
  }



  render() {
    const { gameState, roomId, problems, username, sessionMap, position, round, sessionId, prevAnswers } = this.state;
    switch (gameState) {
      case PRE_LOBBY:
        return <h1>Room doesn't exist</h1>
      case LOBBY:
        return (
          <div className="lobby-container">
            <header className="lobby-header">
              <h1>Multiplayer Lobby</h1>
              <p>Wait for the host to start the game</p>
            </header>

            <div className="lobby-room-id">
              <div className="label">Room Code</div>
              <div className="room-code">{roomId}</div>
            </div>

            <div className="lobby-card">
              <div className="lobby-card-title">Players ({Object.keys(sessionMap).length})</div>
              <div className="lobby-players">
                {Object.entries(sessionMap).map(([sessionId, player], index) => (
                  <div key={sessionId} className={`lobby-player ${index === position ? 'current' : ''}`}>
                    <div className="lobby-player-color" style={{ backgroundColor: player.colour }}></div>
                    <span className="lobby-player-name">{player.username}</span>
                    {index === 0 && <span className="lobby-player-host">Host</span>}
                  </div>
                ))}
              </div>
            </div>

            {position === 0 && (
              <div className="lobby-card">
                <div className="lobby-card-title">Difficulty Settings</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Character Range</div>
                    <div style={{ fontSize: '16px', color: 'var(--accent-secondary)' }}>
                      {this.state.difficulty[0]} - {this.state.difficulty[1]}
                    </div>
                  </div>
                  <button className="settings-btn" onClick={this.openSettings}>
                    Adjust
                  </button>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Beginner (0-500)</span>
                    <span>Advanced (2000+)</span>
                  </div>
                </div>
                <SettingsModal 
                  show={this.state.showSettings}
                  onClose={this.closeSettings}
                  setDifficulty={this.setDifficulty} 
                  difficulty={this.state.difficulty} 
                  onReset={this.resetButton}
                  onApply={() => {}}
                />
              </div>
            )}

            <div className="lobby-actions">
              <button className="lobby-btn secondary" onClick={this.handleCopyClick}>Copy Room Link</button>
              <button className="lobby-btn secondary" onClick={this.updateUsername}>Change Username</button>
              {position === 0 && (
                <>
                  <button className="lobby-btn primary" onClick={this.startGame}>Start Game</button>
                </>
              )}
              {position !== 0 && (
                <div className="lobby-waiting">Waiting for host to start the game...</div>
              )}
            </div>
          </div>
        );
      case PLAY:
        return <Multiplayer_Game problems={problems} username={username} sessionMap={sessionMap} sessionId={sessionId} round={round} prevAnswers = {prevAnswers} sendStrokes={this.sendStrokes} correctGuess={this.correctGuess} voteNext={this.voteNext} skipVotes={this.state.skipVotes} />
      case GAME_OVER:
        const sessionMapWithMyId = { ...sessionMap, mySessionId: sessionId };
        return <GameOver sessionMap={sessionMapWithMyId} onPlayAgain={this.handlePlayAgain} />
      default:
        return <h1>Room doesn't exist</h1>
    }


  }
}

export default RoomIdPage;