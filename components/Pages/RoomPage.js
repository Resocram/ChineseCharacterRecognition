import React from 'react';
const backendApiUrl = 'http://localhost:5000';
class RoomPage extends React.Component {
  createNewGame = async () => {
    const { id } = this.props; // Add 'id' prop

    try {
      const response = await fetch(`${backendApiUrl}/api/create-multiplayer`, {
        method: 'POST',
        credentials: 'include', // Include credentials in the request
      });

      if (response.ok) {
        // Check if the response includes a redirect URL
        const data = await response.json();
        if (data.redirectUrl) {
          // Append the 'id' to the redirect URL and redirect the user
          window.location.href = `${data.redirectUrl}/${id}`;
        } else {
          console.error('No redirect URL provided');
        }
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
        <button onClick={this.createNewGame}>Create New Game</button>
      </div>
    );
  }
}

export default RoomPage;