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
}
