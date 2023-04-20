export class MathUtil {
  //ランダムな整数を返すメソッド
  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //正規化するメソッド
  static normalize(x: number, max: number, min: number): number {
    return Number(((x - min) / (max - min)).toFixed(2));
  }
  static normalizeAndInvert(x: number, max: number, min: number): number {
    return Number((1 - (x - min) / (max - min)).toFixed(2));
  }
}
