import { Ship } from "./Ship";
import { WebSocket } from "ws";

export class Player {
  index: number;
  name: string;
  ships: Ship[];
  ws?: WebSocket;
  boardSize = 10;

  constructor(index: number, name: string, ws?: WebSocket) {
    this.index = index;
    this.name = name;
    this.ships = [];
    this.ws = ws;
  }

  addShips(
    shipsData: {
      position: { x: number; y: number };
      direction: boolean;
      length: number;
      type: "small" | "medium" | "large" | "huge";
    }[]
  ): void {
    this.ships = shipsData.map(
      (shipData) =>
        new Ship(
          shipData.position.x,
          shipData.position.y,
          shipData.direction,
          shipData.length,
          shipData.type
        )
    );
    this.validateShips();
  }

  private validateShips(): void {
    // Check all positions are within bounds
    for (const ship of this.ships) {
      for (const pos of ship.positions) {
        if (
          pos.x < 0 ||
          pos.x >= this.boardSize ||
          pos.y < 0 ||
          pos.y >= this.boardSize
        ) {
          throw new Error("Ship out of bounds");
        }
      }
    }

    // Check for overlapping ships
    const allPositions = this.ships.flatMap((ship) => ship.positions);
    const positionSet = new Set(allPositions.map((pos) => `${pos.x},${pos.y}`));
    if (positionSet.size !== allPositions.length) {
      throw new Error("Ships overlap");
    }
  }

  receiveAttack(x: number, y: number): { status: "miss" | "shot" | "killed" } {
    for (const ship of this.ships) {
      if (ship.isHit(x, y)) {
        const result = ship.recordHit(x, y);
        return { status: result };
      }
    }
    return { status: "miss" };
  }

  allShipsSunk(): boolean {
    return this.ships.every((ship) => ship.isSunk());
  }
}
