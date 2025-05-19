import { RoomPlayer } from "../types/types";

export interface Room {
  roomId: number;
  roomUsers: RoomPlayer[];
}

const rooms: Room[] = [];
let newRoomId = 1;

export function createRoom(): Room {
  const room: Room = {
    roomId: newRoomId++,
    roomUsers: [],
  };
  rooms.push(room);
  return room;
}

export const addUserToRoom = (
  roomId: number,
  user: RoomPlayer
): Room | undefined => {
  const room = rooms.find((r) => r.roomId === roomId);
  if (
    room &&
    room.roomUsers.length < 2 &&
    !room.roomUsers.find((u) => u.index === user.index)
  ) {
    room.roomUsers.push(user);
    return room;
  }
  return undefined;
};

export const removeRoom = (roomId: number) => {
  const index = rooms.findIndex((r) => r.roomId === roomId);
  if (index !== -1) {
    rooms.splice(index, 1);
  }
};

export const getRooms = () => {
  return rooms;
};

export const getRoomById = (roomId: number) => {
  return rooms.find((r) => r.roomId === roomId);
};
