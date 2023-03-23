import { IFirstStage } from "../stage/IFirstStage";

export interface IStageFactory {
  createFirstStage(): IFirstStage;
}
