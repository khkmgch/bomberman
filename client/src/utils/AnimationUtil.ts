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
    for (const value of Object.values(Constant.CAT)) {
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
      repeat: -1,
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

  static createFlowerAnim(anims: Phaser.Animations.AnimationManager) {
    for (const value of Object.values(Constant.FLOWER)) {
      anims.create({
        key: `${value}-anim`,
        frameRate: 1,
        repeat: -1,
        frames: anims.generateFrameNumbers(value, {
          frames: [0, 5, 10, 15],
        }),
      });
    }
  }
  static createGrassAnim(anims: Phaser.Animations.AnimationManager) {
    for (const value of Constant.GRASS) {
      anims.create({
        key: `${value}-anim`,
        frameRate: 1,
        repeat: -1,
        frames: anims.generateFrameNumbers(value, {
          frames: [0, 5, 10, 15],
        }),
      });
    }
  }
  static createWaterAnim(anims: Phaser.Animations.AnimationManager) {
    for (const value of Constant.WATER) {
      anims.create({
        key: `${value}-anim`,
        frameRate: 5,
        repeat: -1,
        frames: anims.generateFrameNumbers(value, {
          start: 0,
          end: 7,
        }),
      });
    }
  }
  static setCatAnim(
    sprite: Phaser.GameObjects.Sprite,
    animation: string,
    direction: number
  ) {
    if (!sprite.anims.isPlaying) sprite.play(animation);
    else if (sprite.anims.getName() !== animation) sprite.play(animation);
    //右方向の場合は左方向の動きを反転させる
    sprite.setFlipX(direction === 1);
  }

  static setEdgeObstacleAnim(
    sprite: Phaser.GameObjects.Sprite,
    animation: string
  ) {
    if (!sprite.anims.isPlaying) sprite.play({ key: animation, repeat: -1 });
    else if (sprite.anims.getName() !== animation)
      sprite.play({ key: animation, repeat: -1 });
  }
  static setGroundAnim(sprite: Phaser.GameObjects.Sprite, animation: string) {
    if (!sprite.anims.isPlaying) sprite.play({ key: animation, repeat: -1 });
    else if (sprite.anims.getName() !== animation)
      sprite.play({ key: animation, repeat: -1 });
  }

  static setBombAnim(
    sprite: Phaser.GameObjects.Sprite,
    animation: string
  ) {
    if (!sprite.anims.isPlaying) sprite.play(animation);
    else if (sprite.anims.getName() !== animation) sprite.play(animation);
  }
  static setExplosionAnim(
    sprite: Phaser.GameObjects.Sprite,
    animation: string
  ) {
    if (!sprite.anims.isPlaying) sprite.play(animation);
    else if (sprite.anims.getName() !== animation) sprite.play(animation);
  }
}
