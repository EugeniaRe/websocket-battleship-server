import { createRoom, addUserToRoom, removeRoom, getRooms } from "../db/rooms";
import { getAllUsers, getUserById } from "../db/users";
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
    name: user.name,
    index: user.index,
  });

  // sendUpdateRoom();

  if (room && room.roomUsers.length === 2) {
    // const player1 = new Player(room.roomUsers[0].index, room.roomUsers[0].name);
    // const player2 = new Player(room.roomUsers[1].index, room.roomUsers[1].name);

    // const gameId = createGame([player1, player2]);
    const [player1, player2] = room.roomUsers;
    const game = createGame(player1.index, player2.index);
    console.log(clients);

    // const response1 = {
    //   type: "create_game",
    //   data: JSON.stringify({
    //     idGame: game.gameId,
    //     idPlayer: ws.userId,
    //   }),
    //   id: 0,
    // };

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const response1 = {
          type: "create_game",
          data: JSON.stringify({
            idGame: game.gameId,
            idPlayer: client.userId,
          }),
          id: 0,
        };
        client.send(JSON.stringify(response1));
      }
    });

    // ws.send(JSON.stringify(response1));
    // broadcast(response1);

    // const response2 = {
    //   type: "create_game",
    //   data: JSON.stringify({
    //     idGame: game.gameId,
    //     idPlayer: player2.index,
    //   }),
    //   id: 0,
    // };

    // const user1 = getUserById(player1.index);
    // const user2 = getUserById(player2.index);

    // console.log(response2);

    // user1?.ws?.send(JSON.stringify(response1));

    // user2?.ws?.send(JSON.stringify(response2));

    removeRoom(room.roomId);
  }
  sendUpdateRoom();
};

// export const broadcastRooms = (): void => {
//   const rooms = getRooms();
//   const message = {
//     type: "update_room",
//     data: JSON.stringify(
//       rooms.map((room) => ({
//         roomId: room.roomId,
//         roomUsers: room.roomUsers,
//       }))
//     ),
//     id: 0,
//   };

//   const messageJson = JSON.stringify(message);
//   getAllUsers().forEach((user) => {
//     if (user.ws) {
//       user.ws.send(messageJson);
//     }
//   });
// };
