import { getGame } from "../db/games";
import { getUserById } from "../db/users";
import { BaseMessage, CustomWebSocket } from "../types/types";

export const handleAddShips = (ws: CustomWebSocket, message: BaseMessage) => {
  const { gameId, ships, indexPlayer } = JSON.parse(message.data);
  const game = getGame(gameId);
  if (!game) {
    return;
  }

  const player = game.players.find((p) => p.index === indexPlayer);
  if (!player) {
    return;
  }

  try {
    player.addShips(ships);

    if (game.players.every((p) => p.ships.length === 10)) {
      game.players.forEach((player) => {
        const user = getUserById(player.index);
        if (!user?.ws) return;

        const response = {
          type: "start_game",
          data: JSON.stringify({
            ships: player.ships.map((ship) =>
              JSON.stringify({
                position: ship.positions[0],
                direction: ship.direction,
                length: ship.length,
                type: ship.type,
              })
            ),
            currentPlayerIndex: player.index,
          }),
          id: 0,
        };
        console.log(response);
        user.ws.send(JSON.stringify(response));
      });

      const turnMessage = {
        type: "turn",
        data: JSON.stringify({
          currentPlayer: game.currentPlayerIndex,
        }),
        id: 0,
      };

      const turnMessageJson = JSON.stringify(turnMessage);
      game.players.forEach((player) => {
        const user = getUserById(player.index);
        user?.ws?.send(turnMessageJson);
      });
    }
  } catch (error) {
    console.error("Error adding ships:", error);
  }
};
