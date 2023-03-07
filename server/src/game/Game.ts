import { Inject } from '@nestjs/common';
import { Server } from 'socket.io';
import { EventsGateway } from 'src/events/events.gateway';
import { Stage } from './Stage';

export class Game {
  constructor(
    @Inject(EventsGateway) private readonly eventsGateway: EventsGateway,
  ) {}

  someMethod() {
    // サーバーへのアクセス
    const server: Server = this.eventsGateway.server;
    new Stage(server).someMethod();
  }
}
