import { Scene } from 'phaser';
import Constant from '../../../server/src/constant';
import Result from '../scenes/Result';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import { ICharacterDTO } from '../dtos/interface/ICharacterDTO';
import Container from 'phaser3-rex-plugins/templates/ui/container/Container';
import TextBox from 'phaser3-rex-plugins/templates/ui/textbox/TextBox';
import Dialog from 'phaser3-rex-plugins/templates/ui/dialog/Dialog';
import GridSizer from 'phaser3-rex-plugins/templates/ui/gridsizer/GridSizer';

export class ResultUtil {
  static createResultTextBox(
    scene: Scene,
    x: number,
    y: number,
    wrapWidth: number,
    fixedWidth: number,
    fixedHeight: number
  ): TextBox {
    let textBox: TextBox = scene.rexUI.add
      .textBox({
        x: x,
        y: y,

        background: scene.rexUI.add
          .roundRectangle(0, 0, 2, 2, 20, Constant.COLOR_NUMBER.POWDER_PINK)
          .setStrokeStyle(3, Constant.COLOR_NUMBER.CHARCOAL_GRAY)
          .setAlpha(0.6),

        text: ResultUtil.getBuiltInText(
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
      .text(0, 0, '- Result -', {
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

  static createBtnLabel(
    scene: Scene,
    text: string,
    fontSize: string,
    colorNum: number
  ): Label {
    const label: Label = scene.rexUI.add.label({
      orientation: 'x',
      background: scene.rexUI.add
        .roundRectangle(0, 0, 10, 10, 10, colorNum)
        .setStrokeStyle(3, Constant.COLOR_NUMBER.CHARCOAL_GRAY),
      text: scene.add.text(0, 0, text, {
        fontSize: fontSize,
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
  static createResultDialog(
    scene: Result,
    x: number,
    y: number,
    characterArr: ICharacterDTO[],
    onLeave: (scene: Result) => void
  ): Dialog {
    const dialog: Dialog = scene.rexUI.add
      .dialog({
        x: x,
        y: y,
        width: 900,
        height: 750,

        background: scene.rexUI.add
          .roundRectangle(0, 0, 100, 100, 20, Constant.COLOR_NUMBER.MIST)
          .setStrokeStyle(3, Constant.COLOR_NUMBER.CHARCOAL_GRAY),

        title: scene.rexUI.add.label({
          background: scene.rexUI.add.roundRectangle(
            0,
            0,
            100,
            40,
            20,
            Constant.COLOR_NUMBER.POWDER_PINK
          ),
          text: scene.add.text(0, 0, '- Result -', {
            fontSize: '15px',
            fontFamily: 'PressStart2P',
            color: Constant.COLOR_STRING.CHARCOAL_GRAY,
          }),
          align: 'center',
          space: {
            left: 15,
            right: 15,
            top: 10,
            bottom: 10,
          },
        }),

        content: ResultUtil.createRoomDialogContent(scene, characterArr),

        actions: [
          ResultUtil.createBtnLabel(
            scene,
            'Go To Title',
            '16px',
            Constant.COLOR_NUMBER.LOTUS_PINK
          ),
        ],

        space: {
          title: 150,
          content: 50,
          action: 100,

          left: 30,
          right: 30,
          top: 30,
          bottom: 30,
        },
      })
      .layout()
      .pushIntoBounds()
      .popUp(500)
      .setDepth(1);

    dialog.on(
      'button.click',
      (button: Label, groupName: string, index: number) => {
        switch (index) {
          case 0:
            onLeave(scene);
            break;
        }
      }
    );

    return dialog;
  }

  static createRoomDialogContent(
    scene: Phaser.Scene,
    characterArr: ICharacterDTO[]
  ): GridSizer {
    const gridSizer: GridSizer = scene.rexUI.add
      .gridSizer({
        x: 0,
        y: 0,
        column: 1,
        row: 4,
        width: 600,
        height: 250,
        columnProportions: 1,
        rowProportions: 1,
        space: {
          top: 10,
          bottom: 10,
          column: 20,
          row: 20,
        },
      })
      .layout();

    for (let i = 0; i < characterArr.length; i++) {
      gridSizer.add(
        ResultUtil.createCharacterRank(scene, characterArr[i], i + 1)
      );
    }

    return gridSizer;
  }
  static createCharacterRank(
    scene: Scene,
    character: ICharacterDTO,
    index: number
  ): Container {
    let height: number = 100;
    let fontSizeOfRank: number = 48;
    let fontSizeOfName: number = 36;
    if (index === 1) {
      height = 150;
      fontSizeOfRank = 88;
      fontSizeOfName = 48;
    }
    return scene.rexUI.add.container(0, 0, 150, height, [
      scene.add
        .text(-300, 0, `${index}`, {
          fontSize: `${fontSizeOfRank}px`,
          color: Constant.COLOR_STRING.POWDER_PINK,
          fontFamily: 'PressStart2P',
        })
        .setStroke(Constant.COLOR_STRING.LOTUS_PINK, 10)
        .setShadow(5, 5, Constant.COLOR_STRING.CHARCOAL_GRAY, 0, true, true)
        .setOrigin(0.5),

      index === 1
        ? scene.add
            .sprite(-100, 0, character.spriteKey)
            .setScale(2.0)
            .play({ key: `${character.spriteKey}-down`, repeat: -1 }, true)
        : scene.add.sprite(-100, 0, character.spriteKey).setScale(1.5),

      scene.add
        .text(150, 0, `${character.name}`, {
          fontSize: `${fontSizeOfName}px`,
          color: Constant.COLOR_STRING.POWDER_PINK,
          fontFamily: 'PressStart2P',
        })
        .setOrigin(0.5),

      scene.add.line(
        0,
        0,
        100,
        50,
        600,
        50,
        Constant.COLOR_NUMBER.CHARCOAL_GRAY
      ),
    ]);
  }
}
