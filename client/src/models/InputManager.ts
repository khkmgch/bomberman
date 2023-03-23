import { Socket } from 'socket.io-client';
import Game from '../scenes/Game';

export class InputManager {
  private keyboard: Phaser.Types.Input.Keyboard.CursorKeys;

  private none = true;
  private prevNone = true;

  constructor(scene: Game, private socket: Socket) {
    this.keyboard = scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keyboard.space)) {
      this.socket.emit('putBomb');
    }

    if (
      !this.keyboard.left ||
      !this.keyboard.right ||
      !this.keyboard.up ||
      !this.keyboard.down
    )
      return;

    //キーが押されているかどうか
    this.none =
      this.keyboard.left.isDown ||
      this.keyboard.right.isDown ||
      this.keyboard.up.isDown ||
      this.keyboard.down.isDown
        ? false
        : true;

    //キーが現在押されている、
    //または、
    //離した（現在押されていなくて直前に押されていた）場合
    if (!this.none || this.none !== this.prevNone) {
      let arrowInput: {
        up: boolean;
        right: boolean;
        down: boolean;
        left: boolean;
      } = {
        up: false,
        right: false,
        down: false,
        left: false,
      };

      if (this.keyboard.left.isDown) {
        arrowInput.left = true;
      } else if (this.keyboard.right.isDown) {
        arrowInput.right = true;
      } else if (this.keyboard.up.isDown) {
        arrowInput.up = true;
      } else if (this.keyboard.down.isDown) {
        arrowInput.down = true;
      }

      this.socket.emit('movePlayer', { movement: arrowInput });
    }

    this.prevNone = this.none;
  }
}
