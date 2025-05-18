import { createRoom, addUserToRoom, removeRoom, getRooms } from "../db/rooms";
import { getUserById } from "../db/users";
import { WebSocket } from "ws";
import { BaseMessage, CustomWebSocket } from "../types/types";
import { createGame } from "../db/games";
import { broadcast, sendUpdateRoom } from "./handlers";

export const handleCreateRoom = (ws: WebSocket, message: BaseMessage): void => {
  createRoom();
  sendUpdateRoom();
};

export const handleAddUserToRoom = (
  ws: CustomWebSocket,
  message: BaseMessage,
  clients: Map<number | string, CustomWebSocket>
) => {
  const { indexRoom } = JSON.parse(message.data);
  const user = getUserById(ws.userId);
  if (!user || !user.ws) {
    return;
  }

  const room = addUserToRoom(indexRoom, {
    index: user.index,
    name: user.name,
  });

  if (room && room.roomUsers.length === 2) {
    const [player1, player2] = room.roomUsers;
    const game = createGame(player1, player2);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const response1 = {
          type: "create_game",
          data: JSON.stringify({
            idGame: game.id,
            idPlayer: client.userId,
          }),
          id: 0,
        };
        if (
          client.userId === player1.index ||
          client.userId === player2.index
        ) {
          client.send(JSON.stringify(response1));
        }
      }
    });
    removeRoom(room.roomId);
  }
  sendUpdateRoom();
};
