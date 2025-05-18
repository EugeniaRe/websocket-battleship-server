import { Player } from "./Player";

export class Game {
  id: number;
  players: Player[];
  currentPlayerIndex: number;
  gameOver: boolean;

  constructor(id: number, players: Player[]) {
    this.id = id;
    this.players = players;
    this.currentPlayerIndex =
      Math.random() > 0.5 ? players[0].index : players[1].index;
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

    // if (targetPlayer.filledSells.some((sell) => sell.x === x && sell.y === y)) {
    //   throw new Error("This sell is already attacked");
    // }

    const result = targetPlayer.receiveAttack(x, y);

    if (targetPlayer.allShipsSunk()) {
      this.gameOver = true;
      return { status: "killed", nextPlayer: playerIndex };
    }

    if (result.status === "miss") {
      this.currentPlayerIndex =
        this.players.find((p) => p.index !== playerIndex)?.index ??
        this.currentPlayerIndex;

      return { status: "miss", nextPlayer: this.currentPlayerIndex };
    }

    return { status: result.status, nextPlayer: playerIndex };
  }

  randomAttack(playerIndex: number): { x: number; y: number } {
    const targetPlayer = this.players.find((p) => p.index !== playerIndex);
    if (!targetPlayer) {
      throw new Error("Target player not found");
    }
    do {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      if (
        !targetPlayer.filledSells.some((sell) => sell.x === x && sell.y === y)
      ) {
        return { x, y };
      }
    } while (true);
    // const x = Math.floor(Math.random() * 10);
    // const y = Math.floor(Math.random() * 10);

    // return { x, y };
  }
}
