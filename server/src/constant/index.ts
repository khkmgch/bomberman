export default class Constant {
  static readonly SCENE = {
    PRELOADER: 'Preloader',
    TITLE: 'Title',
    LOBBY: 'Lobby',
    GAME: 'Game',
    RESULT: 'Result',
  };

  static readonly MAX_PLAYERS_PER_ROOM = 4;
  static readonly USER_KICK_TIMEOUT = 60_000; // 1 minute

  static readonly FRAMERATE = 20;

  static readonly PLAYER_STATE = {
    WAITING: 'WAITING',
    READY: 'READY',
    PLAYING: 'PLAYING',
    FINISHED: 'FINISHED',
  };

  static readonly INVINCIBLE_DURATION = 2000;

  /* サイズ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

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
    BEIGE: 'cat_beige',
    BRONZE: 'cat_bronze',
    BLACK: 'cat_black',
  };

  static readonly ROCK = ['rock1', 'rock2', 'rock3', 'rock4'];

  static readonly BOX = 'box';

  static readonly FLOWER = {
    WHITE: 'flower_white',
    RED: 'flower_red',
  };

  static readonly GRASS = ['grass1', 'grass2', 'grass3'];

  static readonly WATER = ['water1', 'water2', 'water3', 'water4', 'water5'];

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
    MARKER: 'cat_paw',
  };
  static readonly ITEM = {
    BOMB: 'bomb_up',
    FIRE: 'fire_up',
    SPEED: 'speed_up',
    HEAL: 'heal_up',
  };

  static readonly GITHUB = 'github';

  static readonly SPACE = 'space';

  /* 色 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  static readonly COLOR_NUMBER = {
    CHARCOAL_GRAY: 0x4e454a,
    MIST: 0xb4aeb1,
    CORK: 0xc49a6a,
    PEACH: 0xfbd8b5,
    POWDER_PINK: 0xf5ecf4,
    LOTUS_PINK: 0xde82a7,
    NAPLES_YELLOW: 0xfdd35c,
    TURQUOISE_BLUE: 0x00afcc,
  };
  static readonly COLOR_STRING = {
    WHITE: '#ffffff',
    POWDER_PINK: '#f5ecf4',
    CHARCOAL_GRAY: '#4e454a',
    MIST: '#b4aeb1',
    LOTUS_PINK: '#de82a7',
  };

  /* テキスト - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  static readonly NO_ROOM_TEXT = 'No Rooms ... ';

  /* AIアルゴリズム - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

  static readonly ACTION = {
    GET_ITEM: 'GET_ITEM',
    ATTACK_CHARACTER: 'ATTACK_CHARACTER',
    BREAK_OBSTACLE: 'BREAK_OBSTACLE',
  };
  static readonly IMPACT_MAP_WEIGHT_COEFFICIENT = {
    GET_ITEM: {
      ITEM: 0.6,
      EXPLOSION: 1.0,
    },
    BREAK_OBSTACLE: {
      OBSTACLE: 0.6,
      EXPLOSION: 1.0,
    },
    ATTACK_PLAYER: {
      PLAYER: 0.4,
      EXPLOSION: 1.0,
    },
  };
}
