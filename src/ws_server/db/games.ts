import { Game } from "../game/Game";
import { Player } from "../game/Player";

const games: Map<number, Game> = new Map();
let nextGameId = 1;

export const createGame = (players: Player[]): number => {
  const gameId = nextGameId++;
  const game = new Game(gameId, players);
  games.set(gameId, game);
  return gameId;
};

export const getGame = (gameId: number): Game | undefined => {
  return games.get(gameId);
};

export const removeGame = (gameId: number): void => {
  games.delete(gameId);
};

export const getPlayerGame = (playerId: number): Game | undefined => {
  for (const game of games.values()) {
    if (game.players.some((p) => p.index === playerId)) {
      return game;
    }
  }
  return undefined;
};
