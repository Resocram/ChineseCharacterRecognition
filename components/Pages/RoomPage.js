import React from 'react';
const BACKEND_URL = "https://chinese-server-0947b7b24ff4.herokuapp.com"
// const BACKEND_URL = "http://localhost:5000"
class RoomPage extends React.Component {
  createNewGame = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/create-multiplayer`, {
        method: 'POST',
      });

      if (response.ok) {
        // Check if the response includes a redirect URL
        const data = await response.json();
        window.location.href += `/${data.roomId}`

      } else {
        console.error('Failed to create a new game');
      }
    } catch (error) {
      console.error('Error creating a new game:', error);
    }
  };

  render() {
    return (
      <div>
        <h1>Room Page</h1>
        <button className="button" onClick={this.createNewGame}>Create New Game</button>
      </div>

    );
  }
}

export default RoomPage;