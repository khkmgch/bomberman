import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [EventsModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
