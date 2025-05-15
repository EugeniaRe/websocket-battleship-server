"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = createRoom;
exports.addUserToRoom = addUserToRoom;
exports.getRooms = getRooms;
exports.removeRoom = removeRoom;
const rooms = [];
function createRoom(playerIndex, playerName) {
    const room = {
        roomId: rooms.length + 1,
        roomUsers: [
            {
                name: playerName,
                index: playerIndex,
            },
        ],
    };
    rooms.push(room);
    return room;
}
function addUserToRoom(roomId, playerIndex, playerName) {
    const room = rooms.find((r) => r.roomId === roomId);
    if (room && room.roomUsers.length < 2) {
        room.roomUsers.push({
            name: playerName,
            index: playerIndex,
        });
        return room;
    }
    return undefined;
}
function getRooms() {
    return rooms.filter((room) => room.roomUsers.length === 1);
}
function removeRoom(roomId) {
    const index = rooms.findIndex((room) => room.roomId === roomId);
    if (index !== -1) {
        rooms.splice(index, 1);
    }
}
