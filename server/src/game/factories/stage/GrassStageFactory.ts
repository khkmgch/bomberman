import { EventsGateway } from 'src/events/events.gateway';
import { IStageFactory } from 'src/game/interfaces/factory/IStageFactory';
import { IFirstStage } from 'src/game/interfaces/stage/IFirstStage';
import { GrassFirstStage } from 'src/game/models/stages/grass/GrassFirstStage';

export class GrassStageFactory implements IStageFactory {
  constructor(private eventsGateway: EventsGateway, private roomId: string) {}
  createFirstStage(): IFirstStage {
    return new GrassFirstStage(this.eventsGateway, this.roomId);
  }
}
