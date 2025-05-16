import { WebSocket } from "ws";

export interface User {
  name: string;
  password: string;
  index: number;
  wins: number;
  ws?: WebSocket;
}

const users: User[] = [];
let UserId = 1;

export const addUser = (
  name: string,
  password: string,
  ws?: WebSocket
): User => {
  const existingUser = users.find((user) => user.name === name);
  if (existingUser) {
    if (existingUser.password !== password) {
      throw new Error("Invalid password");
    }
    existingUser.ws = ws;
    return existingUser;
  }

  const newUser: User = {
    name,
    password,
    index: UserId++,
    wins: 0,
    ws,
  };
  users.push(newUser);
  return newUser;
};

export const getUserById = (id: number): User | undefined => {
  return users.find((u) => u.index === id);
};

export const getUserByName = (name: string): User | undefined => {
  return users.find((u) => u.name === name);
};

export const getAllUsers = (): User[] => {
  return [...users];
};

export const updateUserWins = (userId: number): void => {
  const user = getUserById(userId);
  if (user) {
    user.wins++;
  }
};

export const removeUserWs = (ws: WebSocket): void => {
  const user = users.find((u) => u.ws === ws);
  if (user) {
    user.ws = undefined;
  }
};
