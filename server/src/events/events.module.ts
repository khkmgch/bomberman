import { Module } from '@nestjs/common';
import { RoomModule } from 'src/room/room.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [RoomModule],
  providers: [EventsGateway]
})
export class EventsModule {}
