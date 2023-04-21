import Constant from '../../../server/src/constant';
import { IBombDTO } from '../dtos/interface/IBombDTO';
import { IBreakableObstacleDTO } from '../dtos/interface/IBreakableObstacleDTO';
import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import { IEdgeObstacleDTO } from '../dtos/interface/IEdgeObstacleDTO';
import { IExplosionDTO } from '../dtos/interface/IExplosionDTO';
import { IFixedObstacleDTO } from '../dtos/interface/IFixedObstacleDTO';
import { IGroundDTO } from '../dtos/interface/IGroundDTO';
import { IItemDTO } from '../dtos/interface/IItemDTO';
import { IMarkerDTO } from '../dtos/interface/IMarkerDTO';
import { IBomb } from '../interfaces/IBomb';
import { IBreakableObstacle } from '../interfaces/IBreakableObstacle';
import { ICharacter } from '../interfaces/ICharacter';
import { IEdgeObstacle } from '../interfaces/IEdgeObstacle';
import { IExplosion } from '../interfaces/IExplosion';
import { IFixedObstacle } from '../interfaces/IFixedObstacle';
import { IGround } from '../interfaces/IGround';
import { IItem } from '../interfaces/IItem';
import { IMarker } from '../interfaces/IMarker';
import Game from '../scenes/Game';
import AnimationUtil from './AnimationUtil';

export class SyncUtil {
  static addGrounds(groundArr: IGroundDTO[], scene: Game): void {
    if (groundArr && groundArr.length > 0) {
      const groundMap: Map<number, IGround> = scene.getObjects().groundMap;
      groundArr.forEach((ground) => {
        if (!groundMap.has(ground.id)) {
          const sprite: Phaser.GameObjects.Sprite = scene.add
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
  static addEdgeObstacles(
    edgeObstacleArr: IEdgeObstacleDTO[],
    scene: Game
  ): void {
    if (edgeObstacleArr && edgeObstacleArr.length > 0) {
      const edgeObstacleMap: Map<number, IEdgeObstacle> =
        scene.getObjects().edgeObstacleMap;
      edgeObstacleArr.forEach((edgeObstacle) => {
        if (!edgeObstacleMap.has(edgeObstacle.id)) {
          const sprite: Phaser.GameObjects.Sprite = scene.add
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
  static addFixedObstacles(
    fixedObstacleArr: IFixedObstacleDTO[],
    scene: Game
  ): void {
    if (fixedObstacleArr && fixedObstacleArr.length > 0) {
      const fixedObstacleMap: Map<number, IFixedObstacle> =
        scene.getObjects().fixedObstacleMap;
      fixedObstacleArr.forEach((fixedObstacle) => {
        if (!fixedObstacleMap.has(fixedObstacle.id)) {
          const sprite: Phaser.GameObjects.Sprite = scene.add
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
  static addBreakableObstacles(
    breakableObstacleArr: IBreakableObstacleDTO[],
    scene: Game
  ): void {
    if (breakableObstacleArr && breakableObstacleArr.length > 0) {
      const breakableObstacleMap: Map<number, IBreakableObstacle> =
        scene.getObjects().breakableObstacleMap;
      breakableObstacleArr.forEach((breakableObstacle) => {
        if (!breakableObstacleMap.has(breakableObstacle.id)) {
          const sprite: Phaser.GameObjects.Sprite = scene.add
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

  static addBomb(bomb: IBombDTO, scene: Game): void {
    if (!bomb) return;

    const bombMap: Map<number, IBomb> = scene.getObjects().bombMap;
    if (bombMap.has(bomb.id)) return;

    const sprite: Phaser.GameObjects.Sprite = scene.add
      .sprite(bomb.x + bomb.size / 2, bomb.y + bomb.size / 2, bomb.spriteKey)
      .setScale(0.6)
      .setOrigin(0.5)
      .setDepth(2);

    AnimationUtil.setBombAnim(sprite, bomb.animation);

    bombMap.set(bomb.id, {
      sprite: sprite,
      sync: null,
    });
  }
  static removeBomb(id: number, scene: Game): void {
    const bombMap: Map<number, IBomb> = scene.getObjects().bombMap;
    if (!bombMap.has(id)) return;

    const bomb: IBomb = bombMap.get(id) as IBomb;
    bomb.sprite.destroy();
    bomb.sync = null;

    bombMap.delete(id);
  }
  static removeRemoveBreakableObstacle(id: number, scene: Game): void {
    const breakableObstacleMap: Map<number, IBreakableObstacle> =
      scene.getObjects().breakableObstacleMap;
    if (!breakableObstacleMap.has(id)) return;

    const breakableObstacle: IBreakableObstacle = breakableObstacleMap.get(
      id
    ) as IBreakableObstacle;
    breakableObstacle.sprite.destroy();
    breakableObstacle.sync = null;

    breakableObstacleMap.delete(id);
  }
  static addItem(item: IItemDTO, scene: Game) {
    if (!item) return;

    const itemMap: Map<number, IItem> = scene.getObjects().itemMap;
    if (itemMap.has(item.id)) return;

    const sprite: Phaser.GameObjects.Sprite = scene.add
      .sprite(item.x + item.size / 2, item.y + item.size / 2, item.spriteKey)
      .setScale(0.8)
      .setOrigin(0.5);

    itemMap.set(item.id, {
      sprite: sprite,
      sync: null,
    });
  }
  static removeItem(id: number, scene: Game): void {
    const itemMap: Map<number, IItem> = scene.getObjects().itemMap;
    if (!itemMap.has(id)) return;

    const item: IItem = itemMap.get(id) as IItem;
    item.sprite.destroy();
    item.sync = null;

    itemMap.delete(id);
  }

  static addMarkers(markerArr: IMarkerDTO[], scene: Game): void {
    if (markerArr && markerArr.length > 0) {
      const markerMap: Map<number, IMarker> = scene.getObjects().markerMap;
      markerArr.forEach((marker: IMarkerDTO) => {
        if (!markerMap.has(marker.id)) {
          const sprite: Phaser.GameObjects.Sprite = scene.add
            .sprite(
              marker.x + marker.size / 2,
              marker.y + marker.size / 2,
              marker.spriteKey
            )
            .setScale(0.6)
            .setOrigin(0.5)
            .setDepth(0);
          markerMap.set(marker.id, {
            sprite: sprite,
            sync: null,
          });
        }
      });
    }
  }
  static removeMarkers(idArr: number[], scene: Game): void {
    if (idArr && idArr.length > 0) {
      const markerMap: Map<number, IMarker> = scene.getObjects().markerMap;
      idArr.forEach((id: number) => {
        if (markerMap.has(id)) {
          const marker: IMarker = markerMap.get(id) as IMarker;
          marker.sprite.destroy();
          marker.sync = null;

          markerMap.delete(id);
        }
      });
    }
  }
  static addExplosions(explosionArr: IExplosionDTO[], scene: Game): void {
    if (explosionArr && explosionArr.length > 0) {
      const explosionMap: Map<number, IExplosion> =
        scene.getObjects().explosionMap;
      explosionArr.forEach((explosion: IExplosionDTO) => {
        if (!explosionMap.has(explosion.id)) {
          const sprite: Phaser.GameObjects.Sprite = scene.add
            .sprite(explosion.x, explosion.y, explosion.spriteKey)
            .setScale(1.0)
            .setOrigin(0)
            .setDepth(2);

          AnimationUtil.setExplosionAnim(sprite, explosion.animation);

          explosionMap.set(explosion.id, {
            sprite: sprite,
            sync: null,
          });
        }
      });
    }
  }
  static removeExplosions(idArr: number[], scene: Game): void {
    if (idArr && idArr.length > 0) {
      const explosionMap: Map<number, IExplosion> =
        scene.getObjects().explosionMap;
      idArr.forEach((id: number) => {
        if (explosionMap.has(id)) {
          const explosion: IExplosion = explosionMap.get(id) as IExplosion;
          explosion.sprite.destroy();
          explosion.sync = null;

          explosionMap.delete(id);
        }
      });
    }
  }

  static addCharacters(characterArr: ICharacterDTO[], scene: Game): void {
    if (characterArr && characterArr.length > 0) {
      const characterMap: Map<number, ICharacter> =
        scene.getObjects().characterMap;
      characterArr.forEach((character: ICharacterDTO) => {
        if (!characterMap.has(character.id)) {
          const sprite: Phaser.GameObjects.Sprite = scene.add
            .sprite(character.x, character.y, character.spriteKey)
            .setScale(1.0)
            .setOrigin(0)
            .setDepth(3);

          const {
            leftGauge,
            rightGauge,
          }: {
            leftGauge: Phaser.GameObjects.Graphics;
            rightGauge: Phaser.GameObjects.Graphics;
          } = SyncUtil.createLifeGauge(character, scene);

          const nameText: Phaser.GameObjects.Text = SyncUtil.createNameText(
            character,
            scene
          );

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
    const cellWidth: number = character.size / character.initStock;
    const sx: number = character.x;
    const sy: number = character.y - 20;

    let color: number = 0x00ff00;
    if (character.stock <= character.initStock / 3) {
      color = 0xff0000;
    }
    const leftGauge: Phaser.GameObjects.Graphics = scene.add
      .graphics()
      .fillStyle(color)
      .fillRect(sx, sy, cellWidth * character.stock, 5);
    const rightGauge: Phaser.GameObjects.Graphics = scene.add
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

  static updateCharacter(scene: Game): void {
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

        const lifeGauge: {
          leftGauge: Phaser.GameObjects.Graphics;
          rightGauge: Phaser.GameObjects.Graphics;
        } = SyncUtil.createLifeGauge(character.sync, scene);

        character.leftGauge = lifeGauge.leftGauge;
        character.rightGauge = lifeGauge.rightGauge;

        //アニメーションを更新
        AnimationUtil.setCatAnim(
          character.sprite,
          character.sync.animation,
          character.sync.direction
        );
      });
    }
  }
  static flashCharacter(id: number, scene: Game): void {
    const characterMap: Map<number, ICharacter> =
      scene.getObjects().characterMap;
    if (!characterMap.has(id)) return;

    const character: ICharacter = characterMap.get(id) as ICharacter;

    const duration: number = Constant.INVINCIBLE_DURATION;
    const interval: number = 250;
    const repeat: number = duration / interval / 2;

    scene.tweens.timeline({
      tweens: [
        {
          targets: character.sprite,
          alpha: 0.5,
          duration: interval,
        },
        {
          targets: character.sprite,
          alpha: 1,
          duration: interval,
        },
      ],
      repeat: repeat,
    });
  }
  static removeCharacter(id: number, scene: Game): void {
    const characterMap: Map<number, ICharacter> =
      scene.getObjects().characterMap;
    if (!characterMap.has(id)) return;

    const character: ICharacter = characterMap.get(id) as ICharacter;
    character.sprite.destroy();
    character.nameText.destroy();
    character.leftGauge.destroy();
    character.rightGauge.destroy();
    character.sync = null;

    characterMap.delete(id);
  }
}
