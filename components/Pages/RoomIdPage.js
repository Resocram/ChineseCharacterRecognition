import React from 'react';
import Cookies from 'js-cookie';

class RoomIdPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: props.roomId, // Initialize roomId from props
      username: Cookies.get('username') || '', // Retrieve username from cookie
      players: [], 
      ws: null,
      
    };
  }

  componentDidMount() {
    const ws = new WebSocket(`ws://localhost:5000/${this.state.roomId}`);
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
    
        if (data.type === 'update_players') {
          console.log("updating players")
          console.log(data.players)
          // Update the players state with the received user list
          console.log("Updating it with all players")
          this.setState({ players: data.players });
        }
      };

    ws.onopen = () => {
    this.setState({ ws }, () => {
      let username = this.state.username
      if (!username) {
          username = prompt('Enter your username:');
          if (username && username.trim() !== '') {
          this.setState({ username: username});
          Cookies.set('username', username)
          
          }
      }
      this.addPlayer(username);
      this.setState({ws: ws})
    }); 

  }
}

    addPlayer = (username) => {
        
        const addPlayer = {
            type: 'update_player',
            username: username, // Include the username
        };
        this.state.ws.send(JSON.stringify(addPlayer));
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
    const newUsername = prompt('Enter your username:');
    if (newUsername.trim() !== '') {
      // Save the updated username in a cookie
      Cookies.set('username', newUsername);
      this.setState((prevState) => ({
        players: [newUsername], 
      }));
    }
    this.addPlayer("test")
  };

  render() {
    const { roomId, username, players } = this.state;

    return (
      <div>
        <h1>Room Page</h1>
        <p>Room ID: {roomId}</p>
        
        <h2>Players:</h2>
        <ul>
          {players.map((user, index) => (
            <li key={index}>
              {user}
            </li>
          ))}
        </ul>
        <button onClick={this.updateUsername}>Change Username</button>
      </div>
    );
  }
}

export default RoomIdPage;