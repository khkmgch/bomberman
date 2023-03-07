import { Server } from 'socket.io';

export class Stage {
  constructor(private readonly server: Server) {}
  someMethod() {
    this.server.emit('message', 'Hello');
  }
}
