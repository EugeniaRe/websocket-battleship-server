// import { Game } from "../game/Game";
import { Player } from "../game/Player";

export type ShipType = "small" | "medium" | "large" | "huge";
export type AttackStatus = "miss" | "shot" | "killed";
export interface Position {
  x: number;
  y: number;
}

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
}

export interface Game {
  gameId: number;
  players: {
    [index: string]: {
      ships: Ship[];
      attacks: Position[];
    };
  };
  currentPlayer: number | string;
}

const games: Map<number, Game> = new Map();
let nextGameId = 1;

export function createGame(
  player1Index: number | string,
  player2Index: number | string
): Game {
  const game: Game = {
    gameId: nextGameId + 1,
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
  games.set(game.gameId, game);
  return game;
}

export const getGame = (gameId: number): Game | undefined => {
  return games.get(gameId);
};

export const removeGame = (gameId: number): void => {
  games.delete(gameId);
};

// export const getPlayerGame = (playerId: number): Game | undefined => {
//   for (const game of games.values()) {
//     if (game.players.some((p) => p.index === playerId)) {
//       return game;
//     }
//   }
//   return undefined;
// };
