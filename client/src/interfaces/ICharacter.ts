import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import { IGameObject } from './IGameObject';

export interface ICharacter extends IGameObject {
  nameText: Phaser.GameObjects.Text;
  leftGauge: Phaser.GameObjects.Graphics;
  rightGauge: Phaser.GameObjects.Graphics;
  sync: ICharacterDTO | null;
}
