import { createRoom, addUserToRoom, removeRoom, getRooms } from "../db/rooms";
import { getAllUsers, getUserById } from "../db/users";
// import { createGame } from "../db/games";
// import { Player } from "../game/Player";
import { WebSocket } from "ws";
import { BaseMessage, CreateRoomMessage } from "../types/types";
import { Player } from "../game/Player";
import { createGame } from "../db/games";
import { sendUpdateRoom } from "./handlers";

export const handleCreateRoom = (ws: WebSocket, message: BaseMessage): void => {
  // const user = getUserById(message.data as unknown as number);
  // if (!user || !user.ws) {
  //   return;
  // }

  // const room = createRoom({
  //   name: user.name,
  //   index: user.index,
  // });
  const room = createRoom();
  console.log(room);
  const e = getRooms();
  console.log(e);
  sendUpdateRoom();

  // broadcastRooms();
};

// export const handleAddUserToRoom = (
//   ws: WebSocket,
//   message: BaseMessage
// ): void => {
//   console.log("handleAddUserToRoom");
//   const { indexRoom } = JSON.parse(message.data);
//   const user = getUserById(message.data as unknown as number); // Temporary cast
//   if (!user || !user.ws) {
//     return;
//   }

//   // console.log(message);

//   const room = addUserToRoom(indexRoom, {
//     name: user.name,
//     index: user.index,
//   });

//   if (room && room.roomUsers.length === 2) {
//     removeRoom(room.roomId);
//     broadcastRooms();

//     const player1 = new Player(room.roomUsers[0].index, room.roomUsers[0].name);
//     const player2 = new Player(room.roomUsers[1].index, room.roomUsers[1].name);

//     const gameId = createGame([player1, player2]);

//     const response1 = {
//       type: "create_game",
//       data: {
//         idGame: gameId,
//         idPlayer: player1.index,
//       },
//       id: 0,
//     };

//     const response2 = {
//       type: "create_game",
//       data: {
//         idGame: gameId,
//         idPlayer: player2.index,
//       },
//       id: 0,
//     };

//     const user1 = getUserById(player1.index);
//     const user2 = getUserById(player2.index);

//     user1?.ws?.send(JSON.stringify(response1));
//     user2?.ws?.send(JSON.stringify(response2));
//   }
// };

export const broadcastRooms = (): void => {
  const rooms = getRooms();
  const message = {
    type: "update_room",
    data: JSON.stringify(
      rooms.map((room) => ({
        roomId: room.roomId,
        roomUsers: room.roomUsers,
      }))
    ),
    id: 0,
  };

  const messageJson = JSON.stringify(message);
  getAllUsers().forEach((user) => {
    if (user.ws) {
      user.ws.send(messageJson);
    }
  });
};
