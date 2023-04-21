import { PriorityQueue } from '../libs/PriorityQueue/PriorityQueue';
import { HeapNode } from '../libs/PriorityQueue/types/HeapNode';
import { Bomb } from '../models/objects/attack/Bomb';
import { BreakableObstacle } from '../models/objects/map/obstacle/BreakableObstacle';
import { EdgeObstacle } from '../models/objects/map/obstacle/EdgeObstacle';
import { FixedObstacle } from '../models/objects/map/obstacle/FixedObstacle';
import { Cell } from '../types/Cell';
import { Index } from '../types/Index';
import { MathUtil } from './MathUtil';

export class NpcUtil {
  //ダイクストラ法で影響マップを作成するメソッド
  //startCellからの距離を値として使用する
  static createImpactMap(startCell: Cell, map: Cell[][]): number[][] {
    const cols: number = map.length;
    const rows: number = map[0].length;
    const impactMap: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => Infinity),
    );
    let max: number = 0;

    //優先度付きキュー
    //priority:number の値が小さい順
    const queue: PriorityQueue<Cell> = new PriorityQueue<Cell>(
      [{ data: startCell, priority: 0 }],
      (a: HeapNode<Cell>, b: HeapNode<Cell>) => a.priority < b.priority,
    );

    //探索したマスのインデックスを格納しておくためのキャッシュ
    let visitedCache: Index[] = [];

    while (!queue.isEmpty()) {
      const currNode: HeapNode<Cell> = queue.pop();
      const currCell: Cell = currNode.data;
      const currPriority: number = currNode.priority;
      const { i, j }: Index = currCell.index;

      if (impactMap[i][j] <= currPriority) {
        continue;
      }
      impactMap[i][j] = currPriority;
      //探索したマスのインデックスをキャッシュに追加
      visitedCache.push({ i, j });

      if (currPriority > max) {
        max = currPriority;
      }

      for (const [offsetI, offsetJ] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]) {
        const nextI: number = i + offsetI;
        const nextJ: number = j + offsetJ;

        if (nextI < 0 || cols - 1 < nextI || nextJ < 0 || rows - 1 < nextJ) {
          continue;
        } else {
          const cell: Cell = map[nextI][nextJ];
          if (
            cell.entity instanceof FixedObstacle ||
            cell.entity instanceof BreakableObstacle ||
            cell.entity instanceof EdgeObstacle ||
            cell.entity instanceof Bomb
          ) {
            continue;
          }
          const priority: number = currPriority + 1;
          queue.insert({ data: cell, priority: priority });
        }
      }
    }

    //正規化
    visitedCache.forEach(({ i, j }: Index) => {
      impactMap[i][j] = MathUtil.normalize(impactMap[i][j], max, 0);
    });

    return impactMap;
  }
}
