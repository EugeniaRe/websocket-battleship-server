import { getGame, removeGame } from "../db/games";
import { getUserById, updateUserWins } from "../db/users";
import { WebSocket } from "ws";
import { BaseMessage, CustomWebSocket } from "../types/types";

export const handleAttack = (
  ws: CustomWebSocket,
  message: BaseMessage
): void => {
  const { x, y, gameId, indexPlayer } = JSON.parse(message.data);
  console.log(x, y, gameId, indexPlayer);
  const game = getGame(gameId);
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

    // Send turn info
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

    // Check if game is over
    if (game.gameOver) {
      const finishMessage = {
        type: "finish",
        data: {
          winPlayer: indexPlayer,
        },
        id: 0,
      };

      updateUserWins(indexPlayer);
      // broadcastWinners();

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

export const handleRandomAttack = (
  ws: WebSocket,
  message: BaseMessage
): void => {
  const { gameId, indexPlayer } = JSON.parse(message.data);
  const game = getGame(gameId);
  if (!game) {
    return;
  }

  //   try {
  //     const { x, y } = game.randomAttack(indexPlayer);
  //     const attackMessage: AttackMessage = {
  //       type: "attack",
  //       data: {
  //         gameId,
  //         x,
  //         y,
  //         indexPlayer,
  //       },
  //       id: 0,
  //     };
  //     handleAttack(ws, attackMessage);
  //   } catch (error) {
  //     console.error("Random attack error:", error);
  //   }
};
