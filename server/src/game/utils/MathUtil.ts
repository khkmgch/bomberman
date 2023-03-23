export class MathUtil {
  //ランダムな整数を返すメソッド
  static getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
