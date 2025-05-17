import { WebSocket } from "ws";
import {
  BaseMessage,
  CreateRoomMessage,
  RegistrationMessage,
} from "../types/types";
import { handleRegistration } from "./auth";
import { handleCreateRoom } from "./room";
import { getRooms } from "../db/rooms";

const clients = new Map<number | string, WebSocket>();

function broadcast(message: any) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

export const sendUpdateRoom = () => {
  const availableRooms = getRooms();
  console.log("availableRooms", availableRooms);
  const updateRoomMessage = {
    type: "update_room",
    data: JSON.stringify(availableRooms),
    id: 0,
  };
  broadcast(updateRoomMessage);
};
export const handleMessage = (ws: WebSocket, message: BaseMessage): void => {
  let currentUser = null;
  try {
    switch (message.type) {
      case "reg":
        handleRegistration(ws, message, clients);
        break;
      case "create_room":
        handleCreateRoom(ws, message as CreateRoomMessage);
        break;
      case "add_user_to_room":
        // handleAddUserToRoom(ws, message as any);
        console.log("add_user_to_room");
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
};
