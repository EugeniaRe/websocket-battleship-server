import { WebSocket } from "ws";
import {
  BaseMessage,
  CreateRoomMessage,
  RegistrationMessage,
} from "../types/types";
import { handleRegistration } from "./auth";
import { handleCreateRoom } from "./room";

export const handleMessage = (ws: WebSocket, message: BaseMessage): void => {
  console.log("Handling message:", message);

  try {
    switch (message.type) {
      case "reg":
        handleRegistration(ws, message as RegistrationMessage);
        break;
      case "create_room":
        handleCreateRoom(ws, message as CreateRoomMessage);
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
};
