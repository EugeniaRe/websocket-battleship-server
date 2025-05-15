"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = handleConnection;
const ws_1 = require("ws");
const players_1 = require("../../db/players");
const rooms_1 = require("../../db/rooms");
const games_1 = require("../../db/games");
const bot_1 = require("../game/bot");
const logic_1 = require("../game/logic");
// Store connected clients
const clients = new Map();
function broadcast(message) {
    clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
function sendToPlayer(playerIndex, message) {
    const client = clients.get(playerIndex);
    if (client && client.readyState === ws_1.WebSocket.OPEN) {
        client.send(JSON.stringify(message));
    }
}
function sendUpdateRoom() {
    const availableRooms = (0, rooms_1.getRooms)();
    const updateRoomMessage = {
        type: "update_room",
        data: availableRooms,
        id: 0,
    };
    broadcast(updateRoomMessage);
}
function sendUpdateWinners() {
    const winners = (0, players_1.getWinners)();
    const updateWinnersMessage = {
        type: "update_winners",
        data: winners.map((winner) => ({
            name: winner.name,
            wins: winner.wins,
        })),
        id: 0,
    };
    broadcast(updateWinnersMessage);
}
function handleConnection(ws) {
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log("Received:", data);
            switch (data.type) {
                case "reg":
                    handleRegistration(ws, data);
                    break;
                case "create_room":
                    handleCreateRoom(ws, data);
                    break;
                case "add_user_to_room":
                    handleAddUserToRoom(ws, data);
                    break;
                case "add_ships":
                    handleAddShips(ws, data);
                    break;
                case "attack":
                    handleAttack(ws, data);
                    break;
                case "randomAttack":
                    handleRandomAttack(ws, data);
                    break;
                default:
                    console.log("Unknown message type:", data.type);
            }
        }
        catch (error) {
            console.error("Error processing message:", error);
        }
    });
    ws.on("close", () => {
        console.log("Client disconnected");
        // Remove client from the map
        for (const [index, client] of clients.entries()) {
            if (client === ws) {
                clients.delete(index);
                break;
            }
        }
    });
}
function handleRegistration(ws, data) {
    const { name, password } = data.data;
    let player = Object.values((0, players_1.getPlayer)(name) || {}).find((p) => p.name === name);
    if (player) {
        // Existing player - check password
        if (player.password !== password) {
            const errorResponse = {
                type: "reg",
                data: {
                    name,
                    index: 0,
                    error: true,
                    errorText: "Invalid password",
                },
                id: 0,
            };
            ws.send(JSON.stringify(errorResponse));
            return;
        }
    }
    else {
        // New player
        player = (0, players_1.addPlayer)(name, password);
    }
    // Store the connection
    clients.set(player.index, ws);
    const response = {
        type: "reg",
        data: {
            name: player.name,
            index: player.index,
            error: false,
            errorText: "",
        },
        id: 0,
    };
    ws.send(JSON.stringify(response));
    sendUpdateRoom();
    sendUpdateWinners();
}
function handleCreateRoom(ws, data) {
    const player = (0, players_1.getPlayer)(data.id);
    if (!player)
        return;
    const room = (0, rooms_1.createRoom)(player.index, player.name);
    sendUpdateRoom();
}
function handleAddUserToRoom(ws, data) {
    const { indexRoom } = data.data;
    const player = (0, players_1.getPlayer)(data.id);
    if (!player)
        return;
    const room = (0, rooms_1.addUserToRoom)(indexRoom, player.index, player.name);
    if (!room)
        return;
    // Remove the room from available rooms
    (0, rooms_1.removeRoom)(indexRoom);
    sendUpdateRoom();
    // Create game for both players
    const [player1, player2] = room.roomUsers;
    const game = (0, games_1.createGame)(player1.index, player2.index);
    // Send create_game to both players
    const createGameMessage = {
        type: "create_game",
        data: {
            idGame: game.idGame,
            idPlayer: 0, // Will be set individually for each player
        },
        id: 0,
    };
    // Send to player1
    createGameMessage.data.idPlayer = player1.index;
    sendToPlayer(player1.index, createGameMessage);
    // Send to player2
    createGameMessage.data.idPlayer = player2.index;
    sendToPlayer(player2.index, createGameMessage);
}
function handleAddShips(ws, data) {
    const { gameId, ships, indexPlayer } = data.data;
    if (!(0, logic_1.validateShips)(ships)) {
        console.log("Invalid ships configuration");
        return;
    }
    (0, games_1.addShips)(gameId, indexPlayer, ships);
    const game = (0, games_1.getGame)(gameId);
    if (!game)
        return;
    // Check if both players have added ships
    const bothPlayersReady = Object.values(game.players).every((player) => player.ships.length > 0);
    if (bothPlayersReady) {
        // Send start_game to both players with their own ships
        Object.keys(game.players).forEach((playerIndex) => {
            const startGameMessage = {
                type: "start_game",
                data: {
                    ships: game.players[playerIndex].ships,
                    currentPlayerIndex: game.currentPlayer,
                },
                id: 0,
            };
            sendToPlayer(playerIndex, startGameMessage);
        });
        // Send first turn message
        const turnMessage = {
            type: "turn",
            data: {
                currentPlayer: game.currentPlayer,
            },
            id: 0,
        };
        broadcast(turnMessage);
    }
}
function handleAttack(ws, data) {
    const { gameId, x, y, indexPlayer } = data.data;
    const game = (0, games_1.getGame)(gameId);
    if (!game || game.currentPlayer !== indexPlayer)
        return;
    const position = { x, y };
    const status = (0, games_1.attack)(gameId, indexPlayer, position);
    // Send attack result to both players
    const attackMessage = {
        type: "attack",
        data: {
            position,
            currentPlayer: indexPlayer,
            status,
        },
        id: 0,
    };
    broadcast(attackMessage);
    // Check if game is finished
    const defenderIndex = Object.keys(game.players).find((index) => index !== indexPlayer.toString());
    if (status === "killed" && defenderIndex) {
        const defenderShips = game.players[defenderIndex].ships;
        const attackerAttacks = game.players[indexPlayer].attacks;
        const gameFinished = checkGameFinished(defenderShips, attackerAttacks);
        if (gameFinished) {
            (0, players_1.updatePlayerWins)(indexPlayer);
            const finishMessage = {
                type: "finish",
                data: {
                    winPlayer: indexPlayer,
                },
                id: 0,
            };
            broadcast(finishMessage);
            sendUpdateWinners();
            return;
        }
    }
    // Send turn message if game continues
    if (status === "miss") {
        const turnMessage = {
            type: "turn",
            data: {
                currentPlayer: game.currentPlayer,
            },
            id: 0,
        };
        broadcast(turnMessage);
    }
    else {
        // Same player gets another turn
        const turnMessage = {
            type: "turn",
            data: {
                currentPlayer: indexPlayer,
            },
            id: 0,
        };
        broadcast(turnMessage);
    }
}
function handleRandomAttack(ws, data) {
    const { gameId, indexPlayer } = data.data;
    const game = (0, games_1.getGame)(gameId);
    if (!game || game.currentPlayer !== indexPlayer)
        return;
    const attackerAttacks = game.players[indexPlayer].attacks;
    const position = (0, bot_1.randomAttack)(attackerAttacks);
    // Process the attack
    handleAttack(ws, {
        ...data,
        data: {
            ...data.data,
            x: position.x,
            y: position.y,
        },
    });
}
