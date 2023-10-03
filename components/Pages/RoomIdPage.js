import React from 'react';
import Cookies from 'js-cookie';

const backendApiUrl = 'http://localhost:5000';
const { v4: uuidv4 } = require('uuid');
class RoomIdPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: props.roomId, // Initialize roomId from props
      username: Cookies.get('username') || '', // Retrieve username from cookie
      players: [],
      sessionId: Cookies.get('sessionId') || '',
      roomExists: false,
      ws: null,
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
      this.setState({ roomExists: true })

    }
  }

  initializeWebSocket() {
    const ws = new WebSocket(`ws://localhost:5000/${this.state.roomId}/${this.state.sessionId}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update_players') {
        this.setState({ players: data.players });
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



  componentWillUnmount() {
    // Close the WebSocket connection when the component unmounts
    if (this.state.ws) {
      this.state.ws.close();
    }
  }

  // Function to update the user's own username
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

  render() {
    const { roomExists, roomId, username, players } = this.state;

    if (!roomExists) {
      return <h1>Room doesn't exist</h1>
    }

    return (
      <div>
        <h1>Room Page</h1>
        <p>Room ID: {roomId}</p>

        <h2>Players:</h2>
        <ul>
          {players.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
        <button onClick={this.updateUsername}>Change Username</button>
      </div>
    );
  }
}

export default RoomIdPage;