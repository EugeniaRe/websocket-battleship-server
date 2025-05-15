"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
// import dotenv from "dotenv";
const handlers_1 = require("./ws/handlers");
// dotenv.config();
const PORT = 3000;
const server = new ws_1.WebSocketServer({ port: Number(PORT) });
console.log(`WebSocket server started on ws://localhost:${PORT}`);
server.on("connection", (ws) => {
    console.log("New client connected");
    (0, handlers_1.handleConnection)(ws);
});
server.on("close", () => {
    console.log("WebSocket server closed");
});
process.on("SIGINT", () => {
    server.close();
    process.exit();
});
