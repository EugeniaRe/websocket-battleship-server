import { getGame, removeGame } from "../db/games";
import { getAllUsers, getUserById, updateUserWins } from "../db/users";
import { BaseMessage } from "../types/types";
import { broadcast } from "./handlers";

export const handleAttack = (message: BaseMessage) => {
  const { x, y, gameId, indexPlayer } = JSON.parse(message.data);
  const game = getGame(gameId);

  console.log(game);
  if (!game) {
    return;
  }

  try {
    if (game.gameOver || indexPlayer !== game.currentPlayerIndex) {
      throw new Error("Not your turn");
    }

    const targetPlayer = game.players.find((p) => p.index !== indexPlayer);
    if (!targetPlayer) {
      throw new Error("Target player not found");
    }

    if (targetPlayer.filledSells.some((sell) => sell.x === x && sell.y === y)) {
      throw new Error("This sell is already attacked");
    }
    const result = game.attack(x, y, indexPlayer);

    const attackResponse = {
      type: "attack",
      data: JSON.stringify({
        position: { x, y },
        currentPlayer: indexPlayer,
        status: result.status,
      }),
      id: 0,
    };

    const attackResponseJson = JSON.stringify(attackResponse);
    game.players.forEach((player) => {
      const user = getUserById(player.index);
      user?.ws?.send(attackResponseJson);
    });

    const turnMessage = {
      type: "turn",
      data: JSON.stringify({
        currentPlayer: result.nextPlayer,
      }),
      id: 0,
    };

    const turnMessageJson = JSON.stringify(turnMessage);
    game.players.forEach((player) => {
      const user = getUserById(player.index);
      user?.ws?.send(turnMessageJson);
    });

    if (game.gameOver) {
      const finishMessage = {
        type: "finish",
        data: JSON.stringify({
          winPlayer: indexPlayer,
        }),
        id: 0,
      };

      updateUserWins(indexPlayer);
      sendWinners();
      const finishMessageJson = JSON.stringify(finishMessage);
      game.players.forEach((player) => {
        const user = getUserById(player.index);
        user?.ws?.send(finishMessageJson);
      });

      removeGame(gameId);
    }
  } catch (error) {
    console.error("Attack error:", error);
  }
};

export const handleRandomAttack = (message: BaseMessage): void => {
  const { gameId, indexPlayer } = JSON.parse(message.data);
  const game = getGame(gameId);
  if (!game) {
    return;
  }

  try {
    const { x, y } = game.randomAttack(indexPlayer);
    const attackMessage = {
      type: "attack",
      data: JSON.stringify({
        gameId,
        x,
        y,
        indexPlayer,
      }),
      id: 0,
    };
    handleAttack(attackMessage);
  } catch (error) {
    console.error("Random attack error:", error);
  }
};

export const sendWinners = () => {
  const winnersMessage = {
    type: "update_winners",
    data: JSON.stringify(
      getAllUsers()
        .filter((user) => user.wins > 0)
        .map((user) => ({
          name: user.name,
          wins: user.wins,
        }))
    ),
    id: 0,
  };

  broadcast(winnersMessage);
};
