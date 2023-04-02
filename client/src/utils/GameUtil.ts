import { Scene } from 'phaser';
import Constant from '../../../server/src/constant';
import Game from '../scenes/Game';

export class GameUtil {
  static setCountDown(
    count: number,
    scene: Game,
    x: number,
    y: number
  ): Phaser.GameObjects.Text {
    const text = scene.add
      .text(x, y, count === 0 ? 'Start' : count.toString(), {
        fontSize: '128px',
        color: Constant.COLOR_STRING.POWDER_PINK,
        fontFamily: 'PressStart2P',
      })
      .setStroke(Constant.COLOR_STRING.LOTUS_PINK, 10)
      .setShadow(5, 5, Constant.COLOR_STRING.CHARCOAL_GRAY, 0, true, true)
      .setOrigin(0.5);

    setTimeout(() => {
      text.destroy();
    }, 500);
    return text;
  }
  static createHeaderBackGround(scene: Scene, x: number, y: number) {
    return scene.rexUI.add
      .sizer({
        x: x,
        y: y,
        width: Constant.HEADER.WIDTH,
        height: Constant.HEADER.HEIGHT,
        orientation: 'x',
      })
      .addBackground(
        scene.rexUI.add
          .roundRectangle(0, 0, 1, 1, 0, Constant.COLOR_NUMBER.MIST)
          .setStrokeStyle(5, Constant.COLOR_NUMBER.CHARCOAL_GRAY)
      )
      .layout();
  }
  static createImg(scene: Scene, x: number, y: number, texture: string) {
    return scene.add.image(x, y, texture).setScale(0.8).setOrigin(0, 0.5);
  }
  static createText(
    scene: Scene,
    x: number,
    y: number,
    text: string
  ): Phaser.GameObjects.Text {
    const fontSize = 24;
    const paddingHeight = (Constant.HEADER.HEIGHT - fontSize) / 2;
    return scene.add
      .text(x, y, text, {
        fontSize: `${fontSize}px`,
        fontFamily: 'PressStart2P',
        color: Constant.COLOR_STRING.POWDER_PINK,
      })
      .setPadding(10, paddingHeight, 10, paddingHeight);
  }
  static createHeader(scene: Game) {
    GameUtil.createHeaderBackGround(
      scene,
      scene.getCenterX(),
      Constant.HEADER.HEIGHT * -0.5
    );
    scene.getHeader().timeText = GameUtil.createText(
      scene,
      50,
      Constant.HEADER.HEIGHT * -1,
      '00:00'
    );
    GameUtil.createImg(
      scene,
      330,
      Constant.HEADER.HEIGHT * -0.5,
      Constant.ITEM.FIRE
    );
    scene.getHeader().fireUpText = GameUtil.createText(
      scene,
      400,
      Constant.HEADER.HEIGHT * -1,
      '× 0'
    );
    GameUtil.createImg(
      scene,
      530,
      Constant.HEADER.HEIGHT * -0.5,
      Constant.ITEM.BOMB
    );
    scene.getHeader().bombUpText = GameUtil.createText(
      scene,
      600,
      Constant.HEADER.HEIGHT * -1,
      '× 0'
    );
    GameUtil.createImg(
      scene,
      730,
      Constant.HEADER.HEIGHT * -0.5,
      Constant.ITEM.SPEED
    );
    scene.getHeader().speedUpText = GameUtil.createText(
      scene,
      800,
      Constant.HEADER.HEIGHT * -1,
      '× 0'
    );
  }
}
