import { WebSocket } from "ws";
import { BaseMessage } from "../types/types";
import { handleRegistration } from "./auth";

export const handleMessage = (ws: WebSocket, message: BaseMessage): void => {
  console.log("Handling message:", message);

  try {
    switch (message.type) {
      case "reg":
        handleRegistration(ws, message);
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
};
