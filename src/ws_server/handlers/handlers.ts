import { WebSocket } from "ws";
import { BaseMessage, CustomWebSocket } from "../types/types";
import { handleRegistration } from "./auth";
import { handleAddUserToRoom, handleCreateRoom } from "./room";
import { getRooms } from "../db/rooms";
import { handleAddShips } from "./ships";
import { handleAttack, handleRandomAttack } from "./game";

const clients = new Map<number | string, CustomWebSocket>();

export function broadcast(message: BaseMessage) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

export const sendUpdateRoom = () => {
  const availableRooms = getRooms();
  const updateRoomMessage = {
    type: "update_room",
    data: JSON.stringify(availableRooms),
    id: 0,
  };
  broadcast(updateRoomMessage);
};
export const handleMessage = (
  ws: CustomWebSocket,
  message: BaseMessage
): void => {
  try {
    switch (message.type) {
      case "reg":
        handleRegistration(ws, message, clients);
        break;
      case "create_room":
        handleCreateRoom(ws, message);
        break;
      case "add_user_to_room":
        handleAddUserToRoom(ws, message, clients);
        break;
      case "add_ships":
        handleAddShips(ws, message);
        break;
      case "attack":
        handleAttack(message);
        break;
      case "randomAttack":
        handleRandomAttack(message);
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
};
