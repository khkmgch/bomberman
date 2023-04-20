import { HeapNode } from './types/HeapNode';

export class HeapLibrary<T> {
  public comparator: (a: HeapNode<T>, b: HeapNode<T>) => boolean;

  constructor(comparator: (a: HeapNode<T>, b: HeapNode<T>) => boolean) {
    this.comparator = comparator;
  }

  public buildHeap(arr: HeapNode<T>[]): void {
    const middle: number = HeapLibrary.parent(arr.length - 1);
    for (let i = middle; i >= 0; i--) {
      this.heapify(arr, arr.length - 1, i);
    }
  }

  public heapify(arr: HeapNode<T>[], heapEnd: number, i: number): void {
    const l: number = HeapLibrary.left(i);
    const r: number = HeapLibrary.right(i);

    let biggest: number = i;
    if (l <= heapEnd && this.comparator(arr[l], arr[biggest])) biggest = l;
    if (r <= heapEnd && this.comparator(arr[r], arr[biggest])) biggest = r;

    if (biggest !== i) {
      const temp: HeapNode<T> = arr[i];
      arr[i] = arr[biggest];
      arr[biggest] = temp;
      this.heapify(arr, heapEnd, biggest);
    }
  }

  public static left(i: number): number {
    return 2 * i + 1;
  }

  public static right(i: number): number {
    return 2 * i + 2;
  }

  public static parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }
}
