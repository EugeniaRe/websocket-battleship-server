import { addShips, getGame } from "../db/games";
import { getUserById } from "../db/users";
import { BaseMessage, CustomWebSocket } from "../types/types";

export const handleAddShips = (
  ws: CustomWebSocket,
  message: BaseMessage
): void => {
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
    addShips(gameId, indexPlayer, ships);

    if (game.players.every((p) => p.ships.length === 10)) {
      console.log("Both players have added ships");
      // Send start game messages to both players
      game.players.forEach((player) => {
        const user = getUserById(player.index);
        if (!user?.ws) return;

        const response = {
          type: "start_game",
          data: JSON.stringify({
            ships: player.ships.map((ship) =>
              JSON.stringify({
                position: ship.position,
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

      // Send first turn message
      //   const turnMessage: TurnMessage = {
      //     type: "turn",
      //     data: {
      //       currentPlayer: game.currentPlayerIndex,
      //     },
      //     id: 0,
      //   };

      //   const turnMessageJson = JSON.stringify(turnMessage);
      //   game.players.forEach((player) => {
      //     const user = getUserById(player.index);
      //     user?.ws?.send(turnMessageJson);
      //   });
    }
  } catch (error) {
    console.error("Error adding ships:", error);
  }
};
