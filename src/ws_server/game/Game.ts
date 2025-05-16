import { Player } from "./Player";

export class Game {
  id: number;
  players: Player[];
  currentPlayerIndex: number;
  gameOver: boolean;

  constructor(id: number, players: Player[]) {
    this.id = id;
    this.players = players;
    this.currentPlayerIndex = 0;
    this.gameOver = false;
  }

  attack(
    x: number,
    y: number,
    playerIndex: number
  ): { status: "miss" | "shot" | "killed"; nextPlayer: number } {
    if (this.gameOver || playerIndex !== this.currentPlayerIndex) {
      throw new Error("Not your turn");
    }

    const targetPlayer = this.players.find((p) => p.index !== playerIndex);
    if (!targetPlayer) {
      throw new Error("Target player not found");
    }

    const result = targetPlayer.receiveAttack(x, y);

    // Check if all ships are sunk
    if (targetPlayer.allShipsSunk()) {
      this.gameOver = true;
      return { status: "killed", nextPlayer: playerIndex };
    }

    // Switch player if miss
    if (result.status === "miss") {
      this.currentPlayerIndex = this.players.findIndex(
        (p) => p.index !== playerIndex
      );
      return { status: "miss", nextPlayer: this.currentPlayerIndex };
    }

    return { status: result.status, nextPlayer: playerIndex };
  }

  randomAttack(playerIndex: number): { x: number; y: number } {
    const targetPlayer = this.players.find((p) => p.index !== playerIndex);
    if (!targetPlayer) {
      throw new Error("Target player not found");
    }

    // Simple random attack - in a real game, you'd want to track previous attacks
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    return { x, y };
  }
}
