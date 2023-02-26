import { Scene } from 'phaser';
import GridTable from 'phaser3-rex-plugins/plugins/gridtable';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import Constant from '../../../server/src/constant';

export default class LobbyUtil {
  static createLobbySizer(
    scene: Scene,
    centerX: number,
    centerY: number,
    width: number,
    height: number
  ) {
    const sizer = scene.rexUI.add
      .sizer({
        x: centerX,
        y: centerY - 350,
        orientation: 'y',
        space: { left: 20, right: 20, top: 20, bottom: 20 },
      })
      .layout();

    //ルーム作成ボタン RoomCreateBtn
    //入室可能なルーム一覧 Rooms

    return sizer;
  }

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
    const label = scene.rexUI.add.label({
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
    return scene.rexUI.add
      .buttons({
        x,
        y,
        orientation: 'x',
        buttons: [LobbyUtil.createNewRoomLabel(scene)],
      })
      .layout()
      .on('button.click', () => {
        scene.events.emit('create_room');
      });
  }
  static createNewRoomLabel(scene: Scene) {
    const label = scene.rexUI.add.label({
      orientation: 'x',
      background: scene.rexUI.add
        .roundRectangle(0, 0, 10, 10, 10, Constant.COLOR_NUMBER.LOTUS_PINK)
        .setStrokeStyle(3, Constant.COLOR_NUMBER.CHARCOAL_GRAY),
      text: scene.add.text(0, 0, 'New Room', {
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
  static createTableOfRooms(scene: Scene, x: number, y: number, rooms: any[]) {
    const Random = Phaser.Math.Between;
    var CreateItems = function (count: number) {
      var data = [];
      for (var i = 0; i < count; i++) {
        data.push({
          id: i,
          color: Random(0, 0xffffff),
        });
      }
      return data;
    };

    const COLOR_PRIMARY = 0x4e342e;
    const COLOR_LIGHT = 0x7b5e57;
    const COLOR_DARK = 0x260e04;
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
            padding: 2,
          },

          reuseCellContainer: true,
        },

        slider: {
          track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
          thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
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
            COLOR_DARK
          ),
          text: scene.add.text(0, 0, 'Online Rooms', {
            fontSize: '20px',
            fontFamily: 'PressStart2P',
            color: Constant.COLOR_STRING.POWDER_PINK,
          }),
          space: { top: 0, bottom: 0, left: 10, right: 10 },
        }),

        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,

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
          let item = cell.item as {
            id: string;
            color: number;
          };
          let index = cell.index;
          if (cellContainer === null) {
            cellContainer = scene.rexUI.add.label({
              width: width,
              height: height,

              orientation: 0,
              background: scene.rexUI.add
                .roundRectangle(0, 0, 20, 20, 0)
                .setStrokeStyle(2, COLOR_DARK),
              icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
              text: scene.add.text(0, 0, '', {
                fontSize: '15px',
                fontFamily: 'PressStart2P',
                color: Constant.COLOR_STRING.CHARCOAL_GRAY,
              }),

              space: {
                icon: 10,
                left: 15,
                top: 0,
              },
            });

            console.log(cell.index + ': create new cell-container');
          } else {
            console.log(cell.index + ': reuse cell-container');
          }

          // Set properties from item value
          cellContainer.setMinSize(width, height); // Size might changed in this demo
          cellContainer.getElement('text').setText(item.id); // Set text of text object
          cellContainer.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
          cellContainer
            .getElement('background')
            .setStrokeStyle(2, COLOR_DARK)
            .setDepth(0);
          return cellContainer;
        },
        items: CreateItems(100),
      })
      .layout();

    let print = scene.add.text(0, 0, '');
    gridTable
      .on(
        'cell.over',
        function (cellContainer: any, cellIndex: number, pointer: any) {
          cellContainer
            .getElement('background')
            .setStrokeStyle(2, COLOR_LIGHT)
            .setDepth(1);
        },
        this
      )
      .on(
        'cell.out',
        function (cellContainer: any, cellIndex: number, pointer: any) {
          cellContainer
            .getElement('background')
            .setStrokeStyle(2, COLOR_DARK)
            .setDepth(0);
        },
        this
      )
      .on(
        'cell.click',
        function (cellContainer: any, cellIndex: number, pointer: any) {
          print.text += 'click ' + cellIndex + ': ' + cellContainer.text + '\n';

          // var nextCellIndex = cellIndex + 1;

          // var nextItem = gridTable.items[nextCellIndex];
          // if (!nextItem) {
          //   return;
          // }
          // nextItem.color = 0xffffff - nextItem.color;
          // gridTable.updateVisibleCell(nextCellIndex);
        },
        this
      );
  }
}
