import { Scene } from 'phaser';
import Constant from '../../../server/src/constant';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import Buttons from 'phaser3-rex-plugins/templates/ui/buttons/Buttons';
import TextBox from 'phaser3-rex-plugins/templates/ui/textbox/TextBox';

export default class TitleUtil {
  static createStartBtn(scene: Scene, x: number, y: number): Buttons {
    return scene.rexUI.add
      .buttons({
        x,
        y,
        orientation: 'x',
        buttons: [TitleUtil.createStartLabel(scene)],
      })
      .layout()
      .on('button.click', () => {
        scene.events.emit('start_lobby');
      });
  }
  static createStartLabel(scene: Scene): Label {
    const label: Label = scene.rexUI.add.label({
      orientation: 'x',
      background: scene.rexUI.add
        .roundRectangle(0, 0, 10, 10, 10, Constant.COLOR_NUMBER.LOTUS_PINK)
        .setStrokeStyle(3, Constant.COLOR_NUMBER.CHARCOAL_GRAY),
      text: scene.add.text(0, 0, 'Get Started', {
        fontSize: '20px',
        fontFamily: 'PressStart2P',
        color: Constant.COLOR_STRING.POWDER_PINK,
      }),
      space: { top: 20, bottom: 20, left: 20, right: 20 },
    });
    label.on('pointerover', () => {
      label.setScale(1.1);
    });
    label.on('pointerout', () => {
      label.setScale(1.0);
    });

    return label;
  }

  static createTitleText(scene: Scene, x: number, y: number): void {
    scene.add
      .text(x, y, 'BomberCat ', {
        fontSize: '160px',
        fontFamily: 'Bangers',
        color: Constant.COLOR_STRING.POWDER_PINK,
      })
      .setStroke(Constant.COLOR_STRING.LOTUS_PINK, 10)
      .setShadow(5, 5, Constant.COLOR_STRING.CHARCOAL_GRAY, 0, true, true);
  }
  static createUsageTextBox(
    scene: Scene,
    x: number,
    y: number,
    config: any
  ): TextBox {
    const GetValue: (source: object, key: string, defaultValue: any) => any =
      Phaser.Utils.Objects.GetValue;
    let wrapWidth: number = GetValue(config, 'wrapWidth', 0);
    let fixedWidth: number = GetValue(config, 'fixedWidth', 0);
    let fixedHeight: number = GetValue(config, 'fixedHeight', 0);

    let textBox: TextBox = scene.rexUI.add
      .textBox({
        x: x,
        y: y,

        background: scene.rexUI.add
          .roundRectangle(0, 0, 2, 2, 20, Constant.COLOR_NUMBER.POWDER_PINK)
          .setStrokeStyle(3, Constant.COLOR_NUMBER.CHARCOAL_GRAY)
          .setAlpha(0.6),

        text: TitleUtil.getBuiltInText(
          scene,
          wrapWidth,
          fixedWidth,
          fixedHeight
        ),

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
  ): Phaser.GameObjects.Text {
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

  static createMoveUsage(scene: Scene, x: number, y: number): void {
    scene.add.image(x, y, Constant.ARROW.UP).setScale(0.8);
    scene.add.image(x + 70, y + 70, Constant.ARROW.RIGHT).setScale(0.8);
    scene.add.image(x, y + 140, Constant.ARROW.DOWN).setScale(0.8);
    scene.add.image(x - 70, y + 70, Constant.ARROW.LEFT).setScale(0.8);
    scene.add
      .sprite(x, y + 70, Constant.CAT.WHITE)
      .play({ key: `${Constant.CAT.WHITE}-down`, repeat: -1 })
      .setScale(1.5);
  }

  static createBombUsage(scene: Scene, x: number, y: number): void {
    scene.add
      .sprite(x + 150, y + 70, Constant.ATTACK.BOMB)
      .play({ key: `${Constant.ATTACK.BOMB}-anim`, repeat: -1 })
      .setScale(0.8);
    scene.add.image(x + 150, y + 140, Constant.SPACE).setScale(0.7);
  }
  static createItemUsage(scene: Scene, x: number, y: number): void {
    Object.entries(Constant.ITEM).forEach(([key, value]) => {
      scene.rexUI.add.container(0, 0, 250, 60, [
        scene.add.image(x, y, value).setScale(0.7).setOrigin(0.3),
        scene.add.text(
          x + 40,
          y,
          `: ${key.charAt(0)}${key.slice(1).toLowerCase()}Up`,
          {
            fontFamily: 'PressStart2P',
            fontSize: '18px',
            color: Constant.COLOR_STRING.CHARCOAL_GRAY,
          }
        ),
      ]);
      y = y + 60;
    });
  }

  static createGitHubBtn(scene: Scene, x: number, y: number): Buttons {
    return scene.rexUI.add
      .buttons({
        x: x,
        y: y,
        orientation: 'x',

        buttons: [TitleUtil.createGitHubLabel(scene)],
      })
      .layout()
      .on('button.click', () => {
        window.open(
          'https://github.com/khkmgch/bomberman',
          '_blank',
          'noreferrer'
        );
      });
  }
  static createGitHubLabel(scene: Scene): Label {
    const label: Label = scene.rexUI.add.label({
      width: 48,
      height: 48,
      background: scene.add.image(0, 0, Constant.GITHUB),
      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    });
    label.on('pointerover', () => {
      label.setScale(1.1);
    });
    label.on('pointerout', () => {
      label.setScale(1.0);
    });
    return label;
  }
}
