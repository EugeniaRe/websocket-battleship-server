import { Ship } from "./Ship";
import { WebSocket } from "ws";

export class Player {
  index: number;
  name: string;
  ships: Ship[];
  ws?: WebSocket;
  filledSells: { x: number; y: number }[] = [];

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
          shipData.position,
          shipData.direction,
          shipData.length,
          shipData.type
        )
    );
  }

  receiveAttack(x: number, y: number): { status: "miss" | "shot" | "killed" } {
    this.filledSells.push({ x, y });
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
