import { BaseMessage, CustomWebSocket } from "../types/types";
import { addUser } from "../db/users";
import { sendUpdateRoom } from "./handlers";
import { sendWinners } from "./game";

export const handleRegistration = (
  ws: CustomWebSocket,
  message: BaseMessage,
  clients: Map<number | string, CustomWebSocket>
) => {
  const { name, password } = JSON.parse(message.data);
  try {
    const user = addUser(name, password, ws);
    ws.userId = user.index;
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
    sendWinners();
    sendUpdateRoom();
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
