import { Scene } from 'phaser';
import Constant from '../../../server/src/constant';

export default class SceneUtil {
  static createBackground(scene: Scene) {
    scene.add
      .sprite(0, 0, Constant.BACKGROUND)
      .setOrigin(0, 0)
      .play(Constant.BACKGROUND, true);
  }
}
