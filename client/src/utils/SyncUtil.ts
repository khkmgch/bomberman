import Constant from '../../../server/src/constant';
import { IBreakableObstacleDTO } from '../dtos/interface/IBreakableObstacleDTO';
import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import { IEdgeObstacleDTO } from '../dtos/interface/IEdgeObstacleDTO';
import { IFixedObstacleDTO } from '../dtos/interface/IFixedObstacleDTO';
import { IGroundDTO } from '../dtos/interface/IGroundDTO';
import { IBreakableObstacle } from '../interfaces/IBreakableObstacle';
import { ICharacter } from '../interfaces/ICharacter';
import { IEdgeObstacle } from '../interfaces/IEdgeObstacle';
import { IFixedObstacle } from '../interfaces/IFixedObstacle';
import { IGround } from '../interfaces/IGround';
import Game from '../scenes/Game';
import AnimationUtil from './AnimationUtil';

export class SyncUtil {
  static setGrounds(groundArr: IGroundDTO[], scene: Game) {
    if (groundArr && groundArr.length > 0) {
      const groundMap: Map<number, IGround> = scene.getObjects().groundMap;
      groundArr.forEach((ground) => {
        if (!groundMap.has(ground.id)) {
          const sprite = scene.add
            .sprite(ground.x, ground.y, ground.spriteKey)
            .setScale(1.0)
            .setOrigin(0);
          if (ground.animation !== '') {
            AnimationUtil.setGroundAnim(sprite, ground.animation);
          }
          groundMap.set(ground.id, {
            sprite: sprite,
            sync: null,
          });
        }
        if (!groundMap.has(ground.id)) {
          const object: IGround = groundMap.get(ground.id) as IGround;
          object.sync = ground;
        }
      });
    }
  }
  static setEdgeObstacles(edgeObstacleArr: IEdgeObstacleDTO[], scene: Game) {
    if (edgeObstacleArr && edgeObstacleArr.length > 0) {
      const edgeObstacleMap: Map<number, IEdgeObstacle> =
        scene.getObjects().edgeObstacleMap;
      edgeObstacleArr.forEach((edgeObstacle) => {
        if (!edgeObstacleMap.has(edgeObstacle.id)) {
          const sprite = scene.add
            .sprite(edgeObstacle.x, edgeObstacle.y, edgeObstacle.spriteKey)
            .setScale(1.0)
            .setOrigin(0);
          if (edgeObstacle.animation !== '') {
            AnimationUtil.setEdgeObstacleAnim(sprite, edgeObstacle.animation);
          }
          edgeObstacleMap.set(edgeObstacle.id, {
            sprite: sprite,
            sync: null,
          });
        }
        if (edgeObstacleMap.has(edgeObstacle.id)) {
          const object: IEdgeObstacle = edgeObstacleMap.get(
            edgeObstacle.id
          ) as IEdgeObstacle;
          object.sync = edgeObstacle;
        }
      });
    }
  }
  static setFixedObstacles(fixedObstacleArr: IFixedObstacleDTO[], scene: Game) {
    if (fixedObstacleArr && fixedObstacleArr.length > 0) {
      const fixedObstacleMap: Map<number, IFixedObstacle> =
        scene.getObjects().fixedObstacleMap;
      fixedObstacleArr.forEach((fixedObstacle) => {
        if (!fixedObstacleMap.has(fixedObstacle.id)) {
          const sprite = scene.add
            .sprite(fixedObstacle.x, fixedObstacle.y, fixedObstacle.spriteKey)
            .setScale(1.0)
            .setOrigin(0);
          fixedObstacleMap.set(fixedObstacle.id, {
            sprite: sprite,
            sync: null,
          });
        }
        if (fixedObstacleMap.has(fixedObstacle.id)) {
          const object: IFixedObstacle = fixedObstacleMap.get(
            fixedObstacle.id
          ) as IFixedObstacle;
          object.sync = fixedObstacle;
        }
      });
    }
  }
  static setBreakableObstacles(
    breakableObstacleArr: IBreakableObstacleDTO[],
    scene: Game
  ) {
    if (breakableObstacleArr && breakableObstacleArr.length > 0) {
      const breakableObstacleMap: Map<number, IBreakableObstacle> =
        scene.getObjects().breakableObstacleMap;
      breakableObstacleArr.forEach((breakableObstacle) => {
        if (!breakableObstacleMap.has(breakableObstacle.id)) {
          const sprite = scene.add
            .sprite(
              breakableObstacle.x,
              breakableObstacle.y,
              breakableObstacle.spriteKey
            )
            .setScale(1.0)
            .setOrigin(0);
          breakableObstacleMap.set(breakableObstacle.id, {
            sprite: sprite,
            sync: null,
          });
        }
        if (breakableObstacleMap.has(breakableObstacle.id)) {
          const object: IBreakableObstacle = breakableObstacleMap.get(
            breakableObstacle.id
          ) as IBreakableObstacle;
          object.sync = breakableObstacle;
        }
      });
    }
  }

  static setCharacters(characterArr: ICharacterDTO[], scene: Game) {
    if (characterArr && characterArr.length > 0) {
      const characterMap: Map<number, ICharacter> =
        scene.getObjects().characterMap;
      characterArr.forEach((character) => {
        if (!characterMap.has(character.id)) {
          const sprite = scene.add
            .sprite(character.x, character.y, character.spriteKey)
            .setScale(1.0)
            .setOrigin(0);

          const {
            leftGauge,
            rightGauge,
          }: {
            leftGauge: Phaser.GameObjects.Graphics;
            rightGauge: Phaser.GameObjects.Graphics;
          } = SyncUtil.createLifeGauge(character, scene);

          const nameText = SyncUtil.createNameText(character, scene);

          characterMap.set(character.id, {
            sprite: sprite,
            leftGauge: leftGauge,
            rightGauge: rightGauge,
            nameText: nameText,
            sync: null,
          });
        }
        if (characterMap.has(character.id)) {
          const object: ICharacter = characterMap.get(
            character.id
          ) as ICharacter;
          object.sync = character;
        }
      });
    }
  }
  static createNameText(
    character: ICharacterDTO,
    scene: Game
  ): Phaser.GameObjects.Text {
    return (
      scene.add
        .text(character.x, character.y - 10, character.name, {
          fontSize: '12px',
          color: Constant.COLOR_STRING.CHARCOAL_GRAY,
          fontFamily: 'PressStart2P',
        })
        // .setTint(0x333333)
        .setOrigin(0)
    );
  }

  //ライフゲージを作るメソッド
  static createLifeGauge(
    character: ICharacterDTO,
    scene: Game
  ): {
    leftGauge: Phaser.GameObjects.Graphics;
    rightGauge: Phaser.GameObjects.Graphics;
  } {
    const cellWidth = character.size / character.initStock;
    const sx = character.x;
    const sy = character.y - 20;

    let color = 0x00ff00;
    if (character.stock <= character.initStock / 3) {
      color = 0xff0000;
    }
    const leftGauge = scene.add
      .graphics()
      .fillStyle(color)
      .fillRect(sx, sy, cellWidth * character.stock, 5);
    const rightGauge = scene.add
      .graphics()
      .fillStyle(0x998877)
      .fillRect(
        sx + cellWidth * character.stock,
        sy,
        cellWidth * (character.initStock - character.stock),
        5
      );
    return { leftGauge, rightGauge };
  }

  // static setCharacters(characterArr: ICharacterDTO[], scene: Game) {
  //   if (characterArr && characterArr.length > 0) {
  //     characterArr.forEach((character) => {
  //       if (!scene.getObjects().characterMap[character.id]) {
  //         const sprite = scene.add
  //           .sprite(character.x, character.y, character.spriteKey)
  //           .setScale(1.0)
  //           .setOrigin(0);

  //         const {
  //           leftGauge,
  //           rightGauge,
  //         }: {
  //           leftGauge: Phaser.GameObjects.Graphics;
  //           rightGauge: Phaser.GameObjects.Graphics;
  //         } = SyncUtil.createLifeGauge(character, scene);

  //         const nameText = SyncUtil.createNameText(character, scene);

  //         scene.getObjects().characterMap[character.id] = {
  //           sprite: sprite,
  //           leftGauge: leftGauge,
  //           rightGauge: rightGauge,
  //           nameText: nameText,
  //           sync: null,
  //         };
  //       }
  //       scene.getObjects().characterMap[character.id].sync = character;
  //     });
  //   }
  // }

  static updateCharacter(scene: Game) {
    //syncのデータを基に、spriteの座標とアニメーションを更新
    const characterMap: Map<number, ICharacter> =
      scene.getObjects().characterMap;
    if (characterMap.size > 0) {
      characterMap.forEach((character: ICharacter) => {
        if (!character.sprite || !character.sync) return;
        //座標を更新
        character.sprite.x = character.sync.x;
        character.sprite.y = character.sync.y;

        character.nameText.destroy();
        character.leftGauge.destroy();
        character.rightGauge.destroy();

        character.nameText = SyncUtil.createNameText(character.sync, scene);

        const lifeGauge = SyncUtil.createLifeGauge(character.sync, scene);

        character.leftGauge = lifeGauge.leftGauge;
        character.rightGauge = lifeGauge.rightGauge;

        //アニメーションを更新
        AnimationUtil.setCatAnimation(
          character.sprite,
          character.sync.animation,
          character.sync.direction
        );
      });
    }
  }
}
