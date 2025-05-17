import { WebSocket } from "ws";
import { BaseMessage } from "../types/types";
import { addUser } from "../db/users";

export const handleRegistration = (
  ws: WebSocket,
  message: BaseMessage,
  clients: Map<number | string, WebSocket>
) => {
  const { name, password } = JSON.parse(message.data);
  try {
    const user = addUser(name, password, ws);
    clients.set(user.index, ws);
    const response = {
      type: "reg",
      data: JSON.stringify({
        name: user.name,
        index: user.index,
        error: false,
        errorText: "",
      }),
      id: 0,
    };
    ws.send(JSON.stringify(response));
  } catch (error) {
    const response = {
      type: "reg",
      data: {
        name,
        index: -1,
        error: true,
        errorText: (error as Error).message,
      },
      id: 0,
    };
    ws.send(JSON.stringify(response));
  }
};
