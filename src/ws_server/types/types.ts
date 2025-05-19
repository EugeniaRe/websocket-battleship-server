import { WebSocket } from "ws";

export interface BaseMessage {
  type: string;
  data: string;
  id: number;
}

export interface CustomWebSocket extends WebSocket {
  userId: number;
}

export interface RoomPlayer {
  index: number;
  name: string;
}
