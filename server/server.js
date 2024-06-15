const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const cors = require('cors');
const DATA = require("../src/data/wordBank.json")
// Create an array to store game rooms
const gameRooms = new Map();

function generateRoomId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result += letters.charAt(randomIndex);
  }

  return result;
}
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.post('/api/create-multiplayer', (req, res) => {
  const roomId = generateRoomId();
  gameRooms.set(roomId, new Map());
  const gameUrl = `/room/${roomId}`;
  res.send({ gameUrl });
});

app.get('/api/check-room/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const exists = gameRooms.has(roomId)
  res.send({ exists });
});

wss.on('connection', (ws, req) => {
  const params = req.url.split('/')
  const roomId = params[1]
  const sessionId = params[2]
  if (!gameRooms.has(roomId)) {
    console.log("Room not found")
    return
  }
  const sessions = gameRooms.get(roomId)

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new Map())
  }
  const session = sessions.get(sessionId)
  if (!session.has('ws')) {
    session.set('ws', [ws])
  } else {
    session.get('ws').push(ws)
  }

  ws.on('message', (message) => {

    const data = JSON.parse(message);

    switch (data.type) {
      case 'update_player':
        const username = data.username;
        session.set('username', username)
        broadcastPlayers();
        break;
      case 'get_players':
        let response = {
          type: 'update_players',
          players: getAllPlayers()
        }
        ws.send(JSON.stringify(response));
        break;
      case 'start_game':
        let difficulty = data.difficulty
        broadcastStart(difficulty)
        break;
      case 'send_strokes':
        let strokeUsername = data.username
        let strokes = data.strokes
        broadcastStrokes(strokeUsername, strokes)
        break;
      default:
        break;
    }
  });

  // Remove websocket connection upon close
  ws.on('close', () => {
    const index = session.get('ws').indexOf(ws)
    session.get('ws').splice(index, 1)
    if (session.get('ws').length === 0) {
      sessions.delete(sessionId)
    }
    if (gameRooms.get(roomId).size === 0) {
      gameRooms.delete(roomId)
    }

    broadcastPlayers()
  });

  // Function to broadcast updated lobby players to all clients in the room
  function broadcastStart(difficulty) {
    const characters = shuffleArray(DATA.slice(difficulty[0], difficulty[1]))
    sessions.forEach((session) => {
      session.get('ws').forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'start_game', characters: characters }));
        }
      })
    }
    )
  }


  // Function to broadcast updated lobby players to all clients in the room
  function broadcastPlayers() {
    let position = 0
    const players = getAllPlayers()
    sessions.forEach((session) => {
      session.get('ws').forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'update_players', players: players, position: position }));
        }
      })
      position += 1
    }
    )
  }

  function broadcastStrokes(strokeUsername, strokes) {
    sessions.forEach((session) => {
      session.get('ws').forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'update_strokes', strokeUsername: strokeUsername, strokes: strokes }));
        }
      })
    }
    )
  }

  function getAllPlayers() {
    const players = []
    sessions.forEach((session) => {
      players.push(session.get('username'))
    })
    return players
  }
  
  function shuffleArray(array) {
    const slicedArray = [...array];
  
    for (let i = slicedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slicedArray[i], slicedArray[j]] = [slicedArray[j], slicedArray[i]];
    }
  
    return slicedArray;
  }

});




server.listen(5000, () => {
  console.log('Server started on port 5000');
});