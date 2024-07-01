const DATA = require("../public/data/wordBank.json")

class GameRoomManager {
    constructor() {
        // Key is roomId, Value is Game
        this.rooms = new Map();
    }

    generateRoomId() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';

        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * letters.length);
            result += letters.charAt(randomIndex);
        }

        return result;
    }

    createRoom() {
        let roomId = this.generateRoomId();
        while (this.roomExists(roomId)) {
            roomId = this.generateRoomId()
        }
        this.rooms.set(roomId, new Game())
        return roomId
    }

    getRoom(roomId) {
        if (this.roomExists(roomId)) {
            return this.rooms.get(roomId)
        }
        console.log("Room ID does not exist")
        return null
    }

    roomExists(roomId) {
        return this.rooms.has(roomId)
    }

    maybeDelete(roomId) {
        const room = this.getRoom(roomId)
        if (room && (room.sessions.length === 0)) {
            this.rooms.delete(roomId)
        }
        return
    }
}

class Game {
    constructor() {
        this.difficultyStart = 0
        this.difficultyEnd = 1000
        this.characters = []
        this.round = 0
        // Key is sessionId, Value is Player
        this.sessions = new Map()
    }

    createPlayer(sessionId) {
        if (this.playerExists(sessionId)) {
            console.log("Session already exists")
        } else {
            this.sessions.set(sessionId, new Player())
        }
        return this.getPlayer(sessionId)
    }

    getPlayer(sessionId) {
        if (this.playerExists(sessionId)) {
            return this.sessions.get(sessionId)
        }
        console.log("Session ID does not exist")
        return null
    }

    playerExists(sessionId) {
        return this.sessions.has(sessionId)
    }

    getAllPlayers() {
        return Array.from(this.sessions.values(), player => player.username);
    }


    // Check if player has any active connections, if not then delete
    maybeDelete(sessionId) {
        const player = this.getPlayer(sessionId)
        if (player && (player.ws.length === 0)) {
            this.sessions.delete(sessionId)
        }
        return
    }

    shuffleArray(array) {
        const slicedArray = [...array];

        for (let i = slicedArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [slicedArray[i], slicedArray[j]] = [slicedArray[j], slicedArray[i]];
        }

        return slicedArray;
    }

    incrementRound() {
        this.round += 1
    }

    shouldNext() {
        return Array.from(this.sessions.values()).every(player => player.next === true);
    }
    resetNext(){
        this.sessions.forEach(player => {
            player.next = false;
        });
    }

    isGameOver(){
        return this.characters.length === this.round
    }

    // BROADCAST FUNCTIONS
    broadcastUpdatePlayers() {
        let position = 0
        const sessionsObj = {};
        this.sessions.forEach((player, sessionId) => {
            sessionsObj[sessionId] = player;
        });
        this.sessions.forEach((player) => {
            player.ws.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'update_players', sessions: JSON.stringify(sessionsObj), position: position }));
                }
            })
            position += 1
        })
    }

    broadcastStart(difficultyStart, difficultyEnd) {
        this.characters = this.shuffleArray(DATA.slice(difficultyStart, difficultyEnd))
        this.sessions.forEach((player) => {
            player.ws.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'start_game', characters: this.characters, round: this.round }));
                }
            })
        })
    }

    broadcastStrokes(sessionId, strokes) {
        this.sessions.forEach((player) => {
            player.ws.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'update_strokes', sessionId: sessionId, strokes: strokes }));
                }
            })
        })
    }

    broadcastRound() {
        const sessionsObj = {};
        this.sessions.forEach((player, sessionId) => {
            sessionsObj[sessionId] = player;
        });
        this.sessions.forEach((player) => {
            player.ws.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'update_round', sessions: JSON.stringify(sessionsObj), round: this.round, gameOver: this.isGameOver() }));
                }
            })
        })
    }


}


class Player {
    constructor() {
        this.username = ""
        this.score = 0
        this.ws = []
        this.strokes = []
        this.next = false
    }

    addConnection(connection) {
        this.ws.push(connection)
        return
    }

    removeConnection(connection) {
        const index = this.ws.indexOf(connection)
        this.ws.splice(index, 1)
        return
    }

    updateUsername(username) {
        this.username = username
        return
    }

    incrementScore() {
        this.score += 1
    }

    goNext() {
        this.next = true
    }
}


module.exports = { GameRoomManager, Game, Player };