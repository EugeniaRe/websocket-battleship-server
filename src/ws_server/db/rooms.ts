import { User } from "./users";

export interface RoomUser {
  name: string;
  index: number;
}

export interface Room {
  roomId: number;
  roomUsers: RoomUser[];
}

const rooms: Room[] = [];
let newRoomId = 1;

export const createRoom = (user: { name: string; index: number }): Room => {
  const newRoom: Room = {
    roomId: newRoomId++,
    roomUsers: [user],
  };
  rooms.push(newRoom);
  return newRoom;
};

export const addUserToRoom = (
  roomId: number,
  user: { name: string; index: number }
): Room | undefined => {
  const room = rooms.find((r) => r.roomId === roomId);
  if (room && room.roomUsers.length < 2) {
    room.roomUsers.push(user);
    return room;
  }
  return undefined;
};

export const removeRoom = (roomId: number): void => {
  const index = rooms.findIndex((r) => r.roomId === roomId);
  if (index !== -1) {
    rooms.splice(index, 1);
  }
};

export const getRooms = (): Room[] => {
  return rooms.filter((room) => room.roomUsers.length === 1);
};

export const getRoomById = (roomId: number): Room | undefined => {
  return rooms.find((r) => r.roomId === roomId);
};
