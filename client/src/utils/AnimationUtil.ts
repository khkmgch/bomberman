import { Scene } from 'phaser';
import Constant from '../../../server/src/constant';

export default class AnimationUtil {
  //背景
  static createBackgroundAnim(anims: Phaser.Animations.AnimationManager) {
    anims.create({
      key: Constant.BACKGROUND,
      frames: anims.generateFrameNumbers(Constant.BACKGROUND, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  //猫
  static createCatAnim(anims: Phaser.Animations.AnimationManager) {
    for (let value of Object.values(Constant.CAT)) {
      anims.create({
        key: `${value}-left`,
        frameRate: 10,
        repeat: 0,
        frames: anims.generateFrameNumbers(value, {
          start: 3,
          end: 5,
        }),
      });
      anims.create({
        key: `${value}-turn-left`,
        frameRate: 10,
        repeat: 0,
        frames: [{ key: value, frame: 4 }],
      });
      anims.create({
        key: `${value}-down`,
        frameRate: 10,
        repeat: 0,
        frames: anims.generateFrameNumbers(value, {
          start: 0,
          end: 2,
        }),
      });
      anims.create({
        key: `${value}-turn-down`,
        frameRate: 10,
        repeat: 0,
        frames: [{ key: value, frame: 1 }],
      });
      anims.create({
        key: `${value}-up`,
        frameRate: 10,
        repeat: 0,
        frames: anims.generateFrameNumbers(value, {
          start: 6,
          end: 8,
        }),
      });
      anims.create({
        key: `${value}-turn-up`,
        frameRate: 10,
        repeat: 0,
        frames: [{ key: value, frame: 7 }],
      });
    }
  }

  static createBombAnim(anims: Phaser.Animations.AnimationManager) {
    anims.create({
      key: `${Constant.ATTACK.BOMB}-anim`,
      frameRate: 10,
      repeat: 2,
      frames: anims.generateFrameNumbers(Constant.ATTACK.BOMB, {
        start: 0,
        end: 7,
      }),
    });
  }

  static createExplosionAnim(anims: Phaser.Animations.AnimationManager) {
    anims.create({
      key: `${Constant.ATTACK.EXPLOSION}-anim`,
      frameRate: 10,
      repeat: 0,
      frames: anims.generateFrameNumbers(Constant.ATTACK.EXPLOSION, {
        start: 0,
        end: 9,
      }),
    });
  }
}
