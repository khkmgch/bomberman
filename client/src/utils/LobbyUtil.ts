import { Scene } from 'phaser';
import GridTable from 'phaser3-rex-plugins/plugins/gridtable';
// import GridTable from 'phaser3-rex-plugins/templates/ui/gridtable/GridTable';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import Constant from '../../../server/src/constant';
import { IRoomDTO } from '../dtos/interface/IRoomDTO';
import Lobby from '../scenes/Lobby';

export default class LobbyUtil {
  static createNameInputLabel(scene: Scene, x: number, y: number) {
    let label = scene.rexUI.add.label({
      width: 200,
      height: 40,
      text: scene.add.text(x, y, 'Name', {
        color: Constant.COLOR_STRING.CHARCOAL_GRAY,
        fontSize: '20px',
        fontFamily: 'PressStart2P',
      }),
      align: 'left',
    });
    return label;
  }

  static createNameInput(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    userName: string
  ) {
    const label: Label = scene.rexUI.add.label({
      background: scene.rexUI.add
        .roundRectangle(x, y, width, height, 10)
        .setFillStyle(Constant.COLOR_NUMBER.POWDER_PINK)
        .setStrokeStyle(3, Constant.COLOR_NUMBER.LOTUS_PINK),

      text: scene.rexUI.add.canvasInput(x, y, width, 50, {
        style: {
          fontSize: 20,
          fontFamily: 'PressStart2P',
          color: Constant.COLOR_NUMBER.CHARCOAL_GRAY,

          'cursor.color': 'black',
          'cursor.backgroundColor': Constant.COLOR_STRING.MIST,
        },
        padding: 15,
        wrap: {
          vAlign: 'center',
        },
        text: userName,
      }),

      space: { top: 5, bottom: 5, left: 5, right: 5 },
    });

    return label;
  }

  static createNewRoomBtn(scene: Scene, x: number, y: number) {
    return LobbyUtil.createBtn(
      scene,
      x,
      y,
      LobbyUtil.createBtnLabel(
        scene,
        'New Room',
        '20px',
        Constant.COLOR_NUMBER.LOTUS_PINK
      )
    ).on('button.click', () => {
      scene.events.emit('create_room');
    });
  }
  static createStartGameBtn(scene: Scene, x: number, y: number) {
    return LobbyUtil.createBtn(
      scene,
      x,
      y,
      LobbyUtil.createBtnLabel(
        scene,
        'Start Game',
        '16px',
        Constant.COLOR_NUMBER.LOTUS_PINK
      )
    )
      .setDepth(1)
      .on('button.click', () => {
        scene.events.emit('start_game');
      });
  }

  static createBtn(
    scene: Scene,
    x: number,
    y: number,
    label: Phaser.GameObjects.GameObject
  ) {
    return scene.rexUI.add
      .buttons({
        x,
        y,
        orientation: 'x',
        buttons: [label],
      })
      .layout();
  }

  static createBtnLabel(
    scene: Scene,
    text: string,
    fontSize: string,
    colorNum: number
  ) {
    const label = scene.rexUI.add.label({
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

  static createTableOfRooms(
    scene: Scene,
    x: number,
    y: number,
    rooms: IRoomDTO[]
  ) {
    var gridTable = scene.rexUI.add
      .gridTable({
        x: x,
        y: y,
        width: 700,
        height: 500,

        scrollMode: 0,

        background: scene.rexUI.add
          .roundRectangle(0, 0, 20, 10, 10, Constant.COLOR_NUMBER.PEACH)
          .setStrokeStyle(3, Constant.COLOR_NUMBER.CHARCOAL_GRAY),

        table: {
          cellWidth: undefined,
          cellHeight: 60,

          columns: 2,

          mask: {
            padding: 10,
          },

          reuseCellContainer: true,
        },

        slider: {
          track: scene.rexUI.add.roundRectangle(
            0,
            0,
            20,
            10,
            10,
            Constant.COLOR_NUMBER.CHARCOAL_GRAY
          ),
          thumb: scene.rexUI.add.roundRectangle(
            0,
            0,
            0,
            0,
            13,
            Constant.COLOR_NUMBER.POWDER_PINK
          ),
        },

        mouseWheelScroller: {
          focus: false,
          speed: 0.1,
        },

        header: scene.rexUI.add.label({
          width: undefined,
          height: 30,

          orientation: 0,
          background: scene.rexUI.add.roundRectangle(
            0,
            0,
            20,
            20,
            0,
            Constant.COLOR_NUMBER.CHARCOAL_GRAY
          ),
          text: scene.add.text(0, 0, 'Online Rooms', {
            fontSize: '20px',
            fontFamily: 'PressStart2P',
            color: Constant.COLOR_STRING.POWDER_PINK,
          }),
          space: { top: 10, bottom: 10, left: 10, right: 10 },
        }),

        space: {
          left: 30,
          right: 30,
          top: 30,
          bottom: 30,

          table: 10,
          header: 10,
          footer: 10,
        },

        createCellContainerCallback: (
          cell: GridTable.CellData,
          cellContainer: any
        ) => {
          let scene = cell.scene;
          let width = cell.width;
          let height = cell.height;
          let item = cell.item as IRoomDTO;
          let index = cell.index;
          if (cellContainer === null) {
            cellContainer = scene.rexUI.add.label({
              width: width,
              height: height,

              orientation: 0,
              background: scene.rexUI.add
                .roundRectangle(
                  0,
                  0,
                  20,
                  20,
                  0,
                  Constant.COLOR_NUMBER.POWDER_PINK
                )
                .setStrokeStyle(2, Constant.COLOR_NUMBER.CHARCOAL_GRAY),
              // icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
              text: scene.add.text(0, 0, '', {
                fontSize: '15px',
                fontFamily: 'PressStart2P',
                color: Constant.COLOR_STRING.CHARCOAL_GRAY,
              }),

              space: {
                icon: 10,
                left: 15,
                right: 15,
                top: 10,
              },
              align: 'right',
            });

            // console.log(cell.index + ': create new cell-container');
          } else {
            // console.log(cell.index + ': reuse cell-container');
          }

          // Set properties from item value
          cellContainer.setMinSize(width, height); // Size might changed in this demo
          cellContainer
            .getElement('text')
            .setText(
              item.id !== '0'
                ? `${item.host.userName} : ${item.numUsers}/${item.maxUsers}`
                : Constant.NO_ROOM_TEXT
            ); // Set text of text object
          // cellContainer.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
          cellContainer
            .getElement('background')
            .setStrokeStyle(2, Constant.COLOR_NUMBER.CHARCOAL_GRAY)
            .setDepth(0);

          return cellContainer;
        },
        // items: CreateItems(100),
        items: rooms,
      })
      .layout();

    return gridTable;
  }

  static createRoomDialog(
    scene: Lobby,
    x: number,
    y: number,
    onLeave: (scene: Lobby) => void,
    onReady: (scene: Lobby) => void
  ) {
    const dialog = scene.rexUI.add
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
          text: scene.add.text(0, 0, 'Waiting for players to ready up ...', {
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

        content: LobbyUtil.createRoomDialogContent(scene),

        actions: [
          LobbyUtil.createBtnLabel(
            scene,
            'Leave',
            '16px',
            Constant.COLOR_NUMBER.MIST
          ),
          LobbyUtil.createBtnLabel(
            scene,
            'Ready',
            '16px',
            Constant.COLOR_NUMBER.TURQUOISE_BLUE
          ),
        ],

        // actionsAlign: 'left',

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
      //.drawBounds(this.add.graphics(), 0xff0000)
      .popUp(500)
      .setDepth(1);

    dialog.on(
      'button.click',
      (button: Label, groupName: string, index: number) => {
        switch (index) {
          case 0:
            onLeave(scene);
            break;
          case 1:
            onReady(scene);
            break;
        }
      }
    );

    return dialog;
  }

  static createRoomDialogContent(scene: Phaser.Scene) {
    const gridSizer = scene.rexUI.add
      .gridSizer({
        x: 0,
        y: 0,
        column: 4,
        row: 1,
        width: 200,
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

    for (const value of Object.values(Constant.CAT)) {
      gridSizer.add(LobbyUtil.createPlayerPanel(scene, value));
    }

    return gridSizer;
  }

  static createPlayerPanel(scene: Phaser.Scene, spriteKey: string) {
    const label = scene.rexUI.add
      .label({
        orientation: 1,
        background: scene.rexUI.add
          .roundRectangle(0, 0, 2, 2, 20, Constant.COLOR_NUMBER.CHARCOAL_GRAY)
          .setStrokeStyle(8, Constant.COLOR_NUMBER.POWDER_PINK),
        icon: scene.rexUI.add.container(0, 0, 150, 150, [
          scene.rexUI.add.roundRectangle(
            0,
            0,
            150,
            150,
            20,
            Constant.COLOR_NUMBER.MIST
          ),
          scene.add
            .text(0, -60, 'not ready', {
              fontSize: '12px',
              color: Constant.COLOR_STRING.POWDER_PINK,
              fontFamily: 'PressStart2P',
            })
            .setOrigin(0.5),
          scene.add
            .triangle(
              5,
              -35,
              -5,
              -5,
              15,
              -5,
              5,
              5,
              Constant.COLOR_NUMBER.NAPLES_YELLOW
            )
            .setOrigin(0.5),
          scene.add
            .sprite(0, 10, spriteKey)
            .setScale(1.5)
            .play({ key: `${spriteKey}-down`, repeat: -1 }, true),
        ]),
        text: scene.add
          .text(0, 0, '', { fontSize: '20px', fontFamily: 'PressStart2P' })
          .setOrigin(0.5),
        expandTextWidth: false,
        expandTextHeight: false,
        space: { left: 20, right: 20, top: 20, bottom: 20, icon: 10 },
      })
      .layout();

    const children = label.getChildren();
    const background = label.getElement('background');
    children.forEach((child: any) => {
      if (child === background) {
        child.setFillStyle(Constant.COLOR_NUMBER.CHARCOAL_GRAY);
      } else {
        label.setChildVisible(child, false);
      }
    });

    return label;
  }

  static flipPlayerPanel(
    scene: Phaser.Scene,
    playerPanel: Label,
    currFace: 'back' | 'front'
  ) {
    const flip = scene.rexUI.add.flip(playerPanel, {
      duration: 200,
      face: currFace,
      front: (gameObject: any) => {
        const children = gameObject.getChildren();
        const background = gameObject.getElement('background');
        for (let i = 0, cnt = children.length; i < cnt; i++) {
          const child = children[i];
          if (child === background) {
            child.setFillStyle(Constant.COLOR_NUMBER.CHARCOAL_GRAY);
          } else {
            gameObject.setChildVisible(child, true);
          }
        }
      },
      back: (gameObject: any) => {
        const children = gameObject.getChildren();
        const background = gameObject.getElement('background');
        for (let i = 0, cnt = children.length; i < cnt; i++) {
          const child = children[i];
          if (child === background) {
            child.setFillStyle(Constant.COLOR_NUMBER.CHARCOAL_GRAY);
          } else {
            gameObject.setChildVisible(child, false);
          }
        }
      },
    });

    flip.flip();
  }
}
