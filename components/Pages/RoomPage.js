import React from 'react';
const BACKEND_URL = "https://chinesecharacterrecognitionbackend.onrender.com"
// const BACKEND_URL = "https://chinese-server-0947b7b24ff4.herokuapp.com"
// const BACKEND_URL = "http://localhost:5000"
class RoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  createNewGame = async () => {
    if (this.state.isLoading) return;
    
    this.setState({ isLoading: true });
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/create-multiplayer`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href += `/${data.roomId}`

      } else {
        console.error('Failed to create a new game');
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error('Error creating a new game:', error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <h1>Create Room</h1>
          <p className="loading-note">
            Note: Server may take 30-60 seconds to spin up on first request
          </p>
          <button 
            className="nav-btn active" 
            onClick={this.createNewGame}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? 'Creating...' : 'OK'}
          </button>
          {this.state.isLoading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Please wait while the server spins up...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RoomPage;
