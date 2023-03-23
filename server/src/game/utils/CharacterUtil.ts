import Constant from 'src/constant';

export class CharacterUtil {
  static getCatSpriteFromId(id: number): string {
    const map: {
      WHITE: string;
      BEIGE: string;
      BRONZE: string;
      BLACK: string;
    } = Constant.CAT;
    let spriteKey = '';
    switch (id) {
      case 0:
        spriteKey = map.WHITE;
        break;
      case 1:
        spriteKey = map.BEIGE;
        break;
      case 2:
        spriteKey = map.BRONZE;
        break;
      case 3:
        spriteKey = map.BLACK;
        break;
    }
    return spriteKey;
  }
}
