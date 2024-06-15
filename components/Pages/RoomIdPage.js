import React, { Component } from "react";
import SettingsModal from "../Components/SettingsModal";

import Multiplayer_Game from "./Multiplayer_Game"
import Cookies from 'js-cookie';

const backendApiUrl = 'http://localhost:5000';
const { v4: uuidv4 } = require('uuid');
const PRE_LOBBY = "PRE_LOBBY";
const LOBBY = "LOBBY";
const PLAY = "PLAY";



class RoomIdPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: props.roomId, // Initialize roomId from props
      username: Cookies.get('username') || '', // Retrieve username from cookie
      players: [],
      sessionId: Cookies.get('sessionId') || '',
      ws: null,
      position: 0,
      gameState: Cookies.get(`gameState_${props.roomId}`) || PRE_LOBBY,
      difficulty: [0, 1000],
      characters: [],
      strokeMap: {}
    };
  }

  async componentDidMount() {
    const response = await fetch(`${backendApiUrl}/api/check-room/${this.state.roomId}`);
    const data = await response.json();
    if (data.exists) {
      if (this.state.sessionId === '') {
        const sessionId = uuidv4()
        this.setState({ sessionId: sessionId }, () => {
          this.initializeWebSocket()
        })
        Cookies.set('sessionId', sessionId)
      } else {
        this.initializeWebSocket()
      }
      if (this.state.gameState === PRE_LOBBY) {
        this.setState({ gameState: LOBBY })
        Cookies.set(`gameState_${this.state.roomId}`, LOBBY)
      }


    }
  }

  initializeWebSocket() {
    const ws = new WebSocket(`ws://localhost:5000/${this.state.roomId}/${this.state.sessionId}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update_players') {
        this.setState({ players: data.players });
        this.setState({ position: data.position })
      }
      else if (data.type === 'start_game') {
        this.setState({ gameState: PLAY, characters: data.characters })
        Cookies.set(`gameState_${this.state.roomId}`, PLAY)
      }
      else if (data.type === 'update_strokes'){
        this.setState((prevState) => ({
          strokeMap: {
              ...prevState.strokeMap,
              [data.strokeUsername]: data.strokes
          }
      }));

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

  getPlayers = () => {
    const getPlayers = {
      type: 'get_players',
    };

    this.state.ws.send(JSON.stringify(getPlayers));
  }

  startGame = () => {
    const startGame = {
      type: 'start_game',
      difficulty: this.state.difficulty
    };
    this.state.ws.send(JSON.stringify(startGame));
  }



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
    const roomUrl = `${window.location.origin}/room/${this.state.roomId}`;

    // Create a temporary element to copy the text
    const tempInput = document.createElement('input');
    tempInput.value = roomUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

  };
  
  setDifficulty = (newDifficulty) => {
    this.setState({ 
      difficulty: newDifficulty,
    })
  }

  resetButton = () => {
    this.setState(() => ({
      difficulty: [0, 1000],
    }));
  }



  render() {
    const { gameState, roomId, characters, username, players, position, ws, strokeMap } = this.state;
    switch (gameState) {
      case PRE_LOBBY:
        return <h1>Room doesn't exist</h1>
      case LOBBY:
        return (
          <div>
            <h1>Room Page</h1>
            <p>Room ID: {roomId}</p>

            <h2>Players:</h2>
            <ul>
              {players.map((user, index) => (
                <li key={index} style={{ fontWeight: index === position ? 'bold' : 'normal' }}>{user}</li>
              ))}
            </ul>
            <button className="button" onClick={this.updateUsername}>Change Username</button>
            <button className="button" onClick={this.handleCopyClick}>Copy URL</button>
            <button className="button" onClick={this.startGame} disabled={position !== 0}>Start Game</button>
            {position === 0 && <SettingsModal setDifficulty={this.setDifficulty} difficulty={this.state.difficulty} onReset={this.resetButton}/>}
          </div>
        );
      case PLAY:
        return <Multiplayer_Game characters={characters} ws={ws} username={username} strokeMap={strokeMap} players={players}/>
      default:
        return <h1>Room doesn't exist</h1>
    }


  }
}

export default RoomIdPage;