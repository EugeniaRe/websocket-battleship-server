import { WebSocket } from "ws";
import {
  BaseMessage,
  CreateRoomMessage,
  IMessage,
  RegistrationMessage,
} from "../types/types";
import { handleRegistration } from "./auth";
import { handleAddUserToRoom, handleCreateRoom } from "./room";

export const handleMessage = (ws: WebSocket, message: BaseMessage): void => {
  // console.log("Handling message:", message);

  let currentUser = null;
  try {
    switch (message.type) {
      case "reg":
        handleRegistration(ws, message as IMessage);
        break;
      case "create_room":
        handleCreateRoom(ws, message as CreateRoomMessage);
        break;
      case "add_user_to_room":
        handleAddUserToRoom(ws, message as any);
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
};
