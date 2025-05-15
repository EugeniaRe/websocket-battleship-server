"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPlayer = addPlayer;
exports.getPlayer = getPlayer;
exports.updatePlayerWins = updatePlayerWins;
exports.getWinners = getWinners;
const players = {};
const winners = [];
function addPlayer(name, password) {
    const player = {
        name,
        password,
        index: Object.keys(players).length + 1,
        wins: 0,
    };
    players[player.index] = player;
    return player;
}
function getPlayer(index) {
    return players[index];
}
function updatePlayerWins(index) {
    const player = players[index];
    if (player) {
        player.wins++;
        updateWinnersList();
    }
}
function updateWinnersList() {
    winners.length = 0;
    winners.push(...Object.values(players)
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10));
}
function getWinners() {
    return winners;
}
