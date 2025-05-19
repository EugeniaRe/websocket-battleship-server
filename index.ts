import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { httpServer } from "./src/http_server/index";
import { handleMessage } from "./src/ws_server/handlers/handlers";
import { CustomWebSocket } from "./src/ws_server/types/types";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const PORT = 3000;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on ws://localhost:${PORT}`);

wss.on("connection", (ws: CustomWebSocket, req: IncomingMessage) => {
  console.log("New client connected");

  ws.userId = 0;

  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message);
      console.log("Received:", data);
      handleMessage(ws, data);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  wss.close(() => {
    console.log("Server closed");
    process.exit();
  });
});
