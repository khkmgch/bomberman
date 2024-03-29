import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    roomId: string;
    clientId: string;
  }
}
