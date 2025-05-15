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
