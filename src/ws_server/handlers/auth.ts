import { WebSocket } from "ws";
import { RegistrationMessage } from "../types/types";
import { addUser } from "../db/users";

export const handleRegistration = (
  ws: WebSocket,
  message: RegistrationMessage
): void => {
  try {
    const { name, password } = message.data;
    const user = addUser(name, password, ws);

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
        name: message.data.name,
        index: -1,
        error: true,
        errorText: (error as Error).message,
      },
      id: 0,
    };
    ws.send(JSON.stringify(response));
  }
};
