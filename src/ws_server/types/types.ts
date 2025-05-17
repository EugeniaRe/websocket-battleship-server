import { WebSocket } from "ws";

export interface BaseMessage {
  type: string;
  data: string;
  id: 0;
}

// export interface BaseMessage {
//   type: string;
//   data:
//     | RegistrationData
//     | string
//     | AddUserToRoomData
//     | Array<UpdateRoomData>
//     | CreateGameData;
// }

export interface RegistrationMessage {
  type: string;
  data: {
    name: string;
    password: string;
  };
  id: 0;
}

export interface RegistrationData {
  name: string;
  password: string;
}

export interface RegistrationResponse {
  type: "reg";
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: 0;
}

export interface RegistrationResponseData {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}

export interface CreateRoomMessage extends BaseMessage {
  type: "create_room";
  data: string;
}

// export interface AddUserToRoomMessage extends BaseMessage {
//   type: "add_user_to_room";
//   data: {
//     indexRoom: number;
//   };
// }

export interface AddUserToRoomData {
  indexRoom: number;
}

// export interface UpdateRoomMessage extends BaseMessage {
//   type: "update_room";
//   data: Array<{
//     roomId: number;
//     roomUsers: Array<{
//       name: string;
//       index: number;
//     }>;
//   }>;
//   id: 0;
// }

export interface UpdateRoomData {
  roomId: number;
  roomUsers: Array<{
    name: string;
    index: number;
  }>;
}

// export interface CreateGameMessage extends BaseMessage {
//   type: "create_game";
//   data: {
//     idGame: number;
//     idPlayer: number;
//   };
//   id: 0;
// }

export interface CreateGameData {
  idGame: number;
  idPlayer: number;
}

export interface CustomWebSocket extends WebSocket {
  userId: number;
}
