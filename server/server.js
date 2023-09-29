const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const cors = require('cors');

// Create an array to store game rooms
const gameRooms = new Map();

// Serve your frontend application here
// app.use(express.static('public'));

// Generate a unique room ID (4 letters)
function generateRoomId() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}
app.use(
    cors({
      origin: 'http://localhost:3000', // Update with your frontend URL
      credentials: true, // Enable credentials
    })
  );
// Create a new game room and return its URL
app.post('/api/create-multiplayer', (req, res) => {
    const roomId = generateRoomId();
    const newRoom = { players: [], gameState: 'waiting' };
    gameRooms.set(roomId, newRoom);
    console.log(req.headers)
    const callerHost = req.headers['origin'];
    const gameUrl = `${callerHost}/room/${roomId}`; // Construct the URL without the base domain
  
    // Redirect the client to the new game URL
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Origin', callerHost);
    res.redirect(gameUrl);
  });

// WebSocket connection handling
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { roomId, playerId, action } = data;
    
    // Implement logic to handle game events and update game state
    handleGameEvent(roomId, playerId, action);
  });
});

server.listen(5000, () => {
  console.log('Server started on port 5000');
});