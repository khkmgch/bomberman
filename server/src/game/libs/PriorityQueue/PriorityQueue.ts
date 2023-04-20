import { HeapLibrary } from './HeapLibrary';
import { HeapNode } from './types/HeapNode';

export class PriorityQueue<T> {
  private heap: HeapNode<T>[];
  private heapLibrary: HeapLibrary<T>;

  constructor(arr: HeapNode<T>[], comparator: (a: HeapNode<T>, b: HeapNode<T>) => boolean) {
    this.heap = [...arr];
    this.heapLibrary = new HeapLibrary<T>(comparator);
    this.heapLibrary.buildHeap(this.heap);
  }

  public isEmpty(): boolean {
    return this.heap.length <= 0;
  }

  public top(): HeapNode<T> {
    return this.heap[0];
  }

  public pop(): HeapNode<T> {
    const temp: HeapNode<T> = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapLibrary.heapify(this.heap, this.heap.length - 1, 0);
    return temp;
  }

  public insert(t: HeapNode<T>): void {
    this.heap.push(t);
    let i: number = this.heap.length - 1;
    let parent: number = HeapLibrary.parent(i);
    while (
      parent >= 0 &&
      !this.heapLibrary.comparator(this.heap[parent], this.heap[i])
    ) {
      const temp: HeapNode<T> = this.heap[i];
      this.heap[i] = this.heap[parent];
      this.heap[parent] = temp;
      i = parent;
      parent = HeapLibrary.parent(i);
    }
  }
}
