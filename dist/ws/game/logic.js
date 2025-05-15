"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAttack = checkAttack;
exports.checkGameFinished = checkGameFinished;
exports.validateShips = validateShips;
function checkAttack(ships, position) {
    for (const ship of ships) {
        const shipPositions = getShipPositions(ship);
        const hitIndex = shipPositions.findIndex((pos) => pos.x === position.x && pos.y === position.y);
        if (hitIndex !== -1) {
            // Check if all ship positions are hit
            const allHit = shipPositions.every((pos) => isPositionAttacked(pos, ships.flatMap((s) => s.attacks || [])));
            return allHit ? "killed" : "shot";
        }
    }
    return "miss";
}
function checkGameFinished(ships, attacks) {
    return ships.every((ship) => {
        const shipPositions = getShipPositions(ship);
        return shipPositions.every((pos) => attacks.some((attack) => attack.x === pos.x && attack.y === pos.y));
    });
}
function validateShips(ships) {
    // Basic validation - should be expanded with actual rules
    if (ships.length !== 10)
        return false;
    const shipTypes = {
        small: { count: 4, length: 1 },
        medium: { count: 3, length: 2 },
        large: { count: 2, length: 3 },
        huge: { count: 1, length: 4 },
    };
    const counts = {
        small: 0,
        medium: 0,
        large: 0,
        huge: 0,
    };
    for (const ship of ships) {
        counts[ship.type]++;
        if (ship.length !== shipTypes[ship.type].length)
            return false;
    }
    for (const type in shipTypes) {
        if (counts[type] !== shipTypes[type].count)
            return false;
    }
    return true;
}
function getShipPositions(ship) {
    const positions = [];
    const { x, y } = ship.position;
    for (let i = 0; i < ship.length; i++) {
        positions.push({
            x: ship.direction ? x + i : x,
            y: ship.direction ? y : y + i,
        });
    }
    return positions;
}
function isPositionAttacked(position, attacks) {
    return attacks.some((attack) => attack.x === position.x && attack.y === position.y);
}
