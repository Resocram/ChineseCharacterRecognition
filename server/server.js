const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const cors = require('cors');

// Create an array to store game rooms
const gameRooms = new Map();

function generateRoomId() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}
app.use(
  cors({
    origin: 'http://localhost:3000', // Update with your frontend URL
  })
);

app.post('/api/create-multiplayer', (req, res) => {
  const roomId = generateRoomId();
  gameRooms.set(roomId, new Map());
  const gameUrl = `/room/${roomId}`; // Construct the URL without the base domain

  res.send({ gameUrl });
});

app.get('/api/check-room/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const exists = gameRooms.has(roomId)
  res.send({ exists });
});



wss.on('connection', (ws, req) => {
  const roomId = req.url.split('/')[1]
  if (!gameRooms.has(roomId)) {
    console.log("Room not found")
    return
  }
  const clients = gameRooms.get(roomId)
  clients.set(ws, new Map())
  const gameRoom = clients.get(ws)


  ws.on('message', (message) => {

    const data = JSON.parse(message);

    switch (data.type) {
      case 'update_player':
        const username = data.username;
        gameRoom.set('username', username)
        broadcastPlayers(getAllPlayers());
        break;
      case 'get_players':
        let response = {
          type: 'update_players',
          players: getAllPlayers()
        }
        ws.send(JSON.stringify(response));
        break;
      default:
        break;
    }
  });

  // Remove websocket connection upon close
  ws.on('close', () => {
    clients.delete(ws)
    broadcastPlayers(getAllPlayers())
  });


  // Function to broadcast updated lobby players to all clients in the room
  function broadcastPlayers(players) {
    clients.forEach((value, client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'update_players', players: players }));
      }
    })
  }

  function getAllPlayers() {
    const players = []
    clients.forEach((value, client) => {
      players.push(value.get('username'))
    })
    return players
  }
});

server.listen(5000, () => {
  console.log('Server started on port 5000');
});