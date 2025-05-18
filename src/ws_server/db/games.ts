// import { Game } from "../game/Game";
// import { Player } from "../game/Player";

import { Game } from "../game/Game";
import { Player } from "../game/Player";
import { RoomPlayer } from "../types/types";

export type ShipType = "small" | "medium" | "large" | "huge";
export type AttackStatus = "miss" | "shot" | "killed";
export interface Position {
  x: number;
  y: number;
}

// export interface Ship {
//   position: Position;
//   direction: boolean;
//   length: number;
//   type: ShipType;
// }

// interface Player {
//   index: number | string;
//   ships: Ship[];
//   attacks: Position[];
// }

// export interface Game {
//   gameId: number;
//   players: Player[];
//   currentPlayer: number | string;
//   gameOver: boolean;
// }

const games: Map<number, Game> = new Map();
let nextGameId = 1;

export function createGame(player1: RoomPlayer, player2: RoomPlayer): Game {
  const newPlayer1 = new Player(player1.index, player1.name);
  const newPlayer2 = new Player(player2.index, player2.name);

  const game = new Game(
    nextGameId++,
    [newPlayer1, newPlayer2]
    // Math.random() > 0.5 ? player1.index : player2.index
  );

  games.set(game.id, game);
  return game;
}

export const getGame = (gameId: number): Game | undefined => {
  return games.get(gameId);
};

export const removeGame = (gameId: number): void => {
  games.delete(gameId);
};

// export function addShips(
//   gameId: number,
//   playerIndex: number,
//   ships: Ship[]
// ): void {
//   const game = games.get(gameId);
//   if (game) {
//     game.players.find((p) => p.index === playerIndex)?.ships.push(...ships);
//   }
// }

// export const getPlayerGame = (playerId: number): Game | undefined => {
//   for (const game of games.values()) {
//     if (game.players.some((p) => p.index === playerId)) {
//       return game;
//     }
//   }
//   return undefined;
// };
