import React from 'react';
const backendApiUrl = 'https://chinese-server-0947b7b24ff4.herokuapp.com';
class RoomPage extends React.Component {
  createNewGame = async () => {
    const { id } = this.props; // Add 'id' prop

    try {
      const response = await fetch(`${backendApiUrl}/api/create-multiplayer`, {
        method: 'POST',
      });

      if (response.ok) {
        // Check if the response includes a redirect URL
        const data = await response.json();
        const { gameUrl } = data;
        window.location.href = `${gameUrl}`;

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