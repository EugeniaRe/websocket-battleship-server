"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = createGame;
exports.addShips = addShips;
exports.attack = attack;
exports.getGame = getGame;
const logic_1 = require("../game/logic");
const games = {};
function createGame(player1Index, player2Index) {
    const game = {
        idGame: Object.keys(games).length + 1,
        players: {
            [player1Index]: {
                ships: [],
                attacks: [],
            },
            [player2Index]: {
                ships: [],
                attacks: [],
            },
        },
        currentPlayer: Math.random() > 0.5 ? player1Index : player2Index,
    };
    games[game.idGame] = game;
    return game;
}
function addShips(gameId, playerIndex, ships) {
    const game = games[gameId];
    if (game) {
        game.players[playerIndex].ships = ships;
    }
}
function attack(gameId, attackerIndex, position) {
    const game = games[gameId];
    if (!game)
        return "miss";
    const defenderIndex = Object.keys(game.players).find((index) => index !== attackerIndex.toString());
    if (!defenderIndex)
        return "miss";
    const status = (0, logic_1.checkAttack)(game.players[defenderIndex].ships, position);
    game.players[attackerIndex].attacks.push(position);
    if (status === "miss") {
        game.currentPlayer = defenderIndex;
    }
    if ((0, logic_1.checkGameFinished)(game.players[defenderIndex].ships, game.players[attackerIndex].attacks)) {
        // Handle game finish
    }
    return status;
}
function getGame(gameId) {
    return games[gameId];
}
