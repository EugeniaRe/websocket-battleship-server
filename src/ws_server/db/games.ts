import { Game } from "../game/Game";
import { Player } from "../game/Player";
import { RoomPlayer } from "../types/types";

const games: Map<number, Game> = new Map();
let nextGameId = 1;

export function createGame(player1: RoomPlayer, player2: RoomPlayer): Game {
  const newPlayer1 = new Player(player1.index, player1.name);
  const newPlayer2 = new Player(player2.index, player2.name);

  const game = new Game(nextGameId++, [newPlayer1, newPlayer2]);

  games.set(game.id, game);
  return game;
}

export const getGame = (gameId: number): Game | undefined => {
  return games.get(gameId);
};

export const removeGame = (gameId: number): void => {
  games.delete(gameId);
};
