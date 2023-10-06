import React from 'react';
import Cookies from 'js-cookie';

const backendApiUrl = 'http://localhost:5000';
const { v4: uuidv4 } = require('uuid');
const PRE_LOBBY = "PRE_LOBBY";
const LOBBY = "LOBBY";
const PLAY = "PLAY";



class RoomIdPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: props.roomId, // Initialize roomId from props
      username: Cookies.get('username') || '', // Retrieve username from cookie
      players: [],
      sessionId: Cookies.get('sessionId') || '',
      ws: null,
      position: 0,
      gameState: Cookies.get(`gameState_${props.roomId}`) || PRE_LOBBY
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
      console.log(this.state.gameState)
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
        this.setState({ gameState: PLAY })
        Cookies.set(`gameState_${this.state.roomId}`, PLAY)
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



  render() {
    const { gameState, roomId, username, players, position } = this.state;
    console.log(gameState)
    console.log(LOBBY)
    console.log(gameState === LOBBY)
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

          </div>
        );
      case PLAY:
        return <h1>Playing</h1>
      default:
        console.log(gameState)

        return <h1>Room doesn't exist</h1>
    }


  }
}

export default RoomIdPage;