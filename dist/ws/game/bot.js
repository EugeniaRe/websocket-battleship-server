"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomAttack = randomAttack;
function randomAttack(attacks) {
    let x, y;
    let position;
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        position = { x, y };
    } while (attacks.some((attack) => attack.x === x && attack.y === y));
    return position;
}
