// import { Game } from "../game/Game";
// import { Player } from "../game/Player";

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

interface Player {
  index: number | string;
  ships: Ship[];
  attacks: Position[];
}

export interface Game {
  gameId: number;
  players: Player[];
  currentPlayer: number | string;
}

const games: Map<number, Game> = new Map();
let nextGameId = 1;

export function createGame(
  player1Index: number | string,
  player2Index: number | string
): Game {
  const game: Game = {
    gameId: nextGameId++,
    players: [
      {
        index: player1Index,
        ships: [],
        attacks: [],
      },
      { index: player2Index, ships: [], attacks: [] },
    ],
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

export function addShips(
  gameId: number,
  playerIndex: number,
  ships: Ship[]
): void {
  const game = games.get(gameId);
  if (game) {
    game.players.find((p) => p.index === playerIndex)?.ships.push(...ships);
  }
}

// export const getPlayerGame = (playerId: number): Game | undefined => {
//   for (const game of games.values()) {
//     if (game.players.some((p) => p.index === playerId)) {
//       return game;
//     }
//   }
//   return undefined;
// };
