import { Scene } from 'phaser';
import Constant from '../../../server/src/constant';

export default class TitleUtil {
  static createTitleText(scene: Scene, x: number, y: number) {
    scene.add
      .text(x, y, 'BomberCat ', {
        fontSize: '156px',
        fontFamily: 'Bangers',
        color: '#fff',
      })
      .setStroke('#696969', 10)
      .setShadow(5, 5, '#808080', 0, true, true)
      .setTint(0xf4a460, 0x3cb371, 0xf08080, 0xffe4e1);
  }
  static createUsageTextBox(scene: Scene, x: number, y: number, config: any) {
    const GetValue = Phaser.Utils.Objects.GetValue;
    let wrapWidth = GetValue(config, 'wrapWidth', 0);
    let fixedWidth = GetValue(config, 'fixedWidth', 0);
    let fixedHeight = GetValue(config, 'fixedHeight', 0);

    let textBox = scene.rexUI.add
      .textBox({
        x: x,
        y: y,

        background: scene.rexUI.add
          .roundRectangle(0, 0, 2, 2, 20, Constant.COLOR_NUMBER.POWDER_PINK)
          .setStrokeStyle(2, Constant.COLOR_NUMBER.CHARCOAL_GRAY)
          .setAlpha(0.6),

        // icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

        text: TitleUtil.getBuiltInText(
          scene,
          wrapWidth,
          fixedWidth,
          fixedHeight
        ),
        // text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        // action: scene.add
        //   .image(0, 0, 'nextPage')
        //   .setTint(COLOR_LIGHT)
        //   .setVisible(false),

        space: {
          left: 0,
          right: 0,
          top: 20,
          bottom: 20,
          icon: 10,
          text: 10,
        },
      })
      .setOrigin(0)
      .layout();

    return textBox;
  }

  static getBuiltInText(
    scene: Phaser.Scene,
    wrapWidth: number,
    fixedWidth: number,
    fixedHeight: number
  ) {
    return scene.add
      .text(0, 0, '- How to Play -', {
        fontFamily: 'PressStart2P',
        fontSize: '20px',
        color: Constant.COLOR_STRING.CHARCOAL_GRAY,
        wordWrap: {
          width: wrapWidth,
        },
        maxLines: 3,
        align: 'center',
      })
      .setFixedSize(fixedWidth, fixedHeight);
  }

  // var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
  //     return scene.rexUI.add.BBCodeText(0, 0, '', {
  //         fixedWidth: fixedWidth,
  //         fixedHeight: fixedHeight,

  //         fontSize: '20px',
  //         wrap: {
  //             mode: 'word',
  //             width: wrapWidth
  //         },
  //         maxLines: 3
  //     })
  // }

  static createMoveUsage(scene: Scene, x: number, y: number) {
    scene.add.image(x, y, Constant.ARROW.UP).setScale(0.8);
    scene.add.image(x + 70, y + 70, Constant.ARROW.RIGHT).setScale(0.8);
    scene.add.image(x, y + 140, Constant.ARROW.DOWN).setScale(0.8);
    scene.add.image(x - 70, y + 70, Constant.ARROW.LEFT).setScale(0.8);
    scene.add
      .sprite(x, y + 70, Constant.CAT.WHITE)
      .play({ key: `${Constant.CAT.WHITE}-down`, repeat: -1 })
      .setScale(1.5);
  }

  static createBombUsage(scene: Scene, x: number, y: number) {
    scene.add
      .sprite(x + 150, y + 70, Constant.ATTACK.BOMB)
      .play({ key: `${Constant.ATTACK.BOMB}-anim`, repeat: -1 })
      .setScale(0.8);
    scene.add.image(x + 150, y + 140, Constant.SPACE).setScale(0.7);
  }
}
