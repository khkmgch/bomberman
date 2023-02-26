export default class Constant {
  static readonly SCENE = {
    PRELOADER: 'Preloader',
    TITLE: 'Title',
    LOBBY: 'Lobby',
  };

  static readonly TILE = {
    SIZE: 64,
    ROWS: 13,
    COLS: 15,
  };

  static readonly HEADER = {
    HEIGHT: 64,
    WIDTH: Constant.TILE.SIZE * Constant.TILE.COLS,
  };

  static readonly CANVAS = {
    WIDTH: Constant.TILE.SIZE * Constant.TILE.COLS,
    HEIGHT: Constant.TILE.SIZE * Constant.TILE.ROWS + Constant.HEADER.HEIGHT,
  };

  static readonly TIP_SIZE = 64;

  /* 画像 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  static readonly CHARACTER = {
    BRAVE: 'brave',
    GHOST: 'ghost',
  };

  static readonly CAT = {
    WHITE: 'cat_white',
    BLACK: 'cat_black',
    BRONZE: 'cat_bronze',
    BEIGE: 'cat_beige',
  };

  static readonly BACKGROUND = 'background';

  static readonly ARROW = {
    UP: 'arrow_up',
    RIGHT: 'arrow_right',
    DOWN: 'arrow_down',
    LEFT: 'arrow_left',
  };

  static readonly ATTACK = {
    BOMB: 'bomb',
    EXPLOSION: 'explosion',
  };

  static readonly GITHUB = 'github';

  static readonly SPACE = 'space';

  /* 色 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  static readonly COLOR_NUMBER = {
    CHARCOAL_GRAY: 0x4e454a,
    PEACH: 0xfbd8b5,
    POWDER_PINK: 0xf5ecf4,
    LOTUS_PINK: 0xde82a7,
  };
  static readonly COLOR_STRING = {
    WHITE: '#ffffff',
    POWDER_PINK: '#f5ecf4',
    CHARCOAL_GRAY: '#4e454a',
    MIST: '#b4aeb1',
    LOTUS_PINK: '#de82a7',
  };
}
