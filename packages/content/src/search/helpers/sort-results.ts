export interface INode<T> {
  data: T;
  label: string;
}

export interface IBinaryHeap<T> {
  insert(node: INode<T>): void;
  remove(): INode<T> | null;
}

export type HeapDirection = "ASC" | "DESC";

export class BinaryHeap<T> implements IBinaryHeap<T> {
  nodes: Array<INode<T>> = [];
  comparator: (one: T, two: T) => number;
  direction: HeapDirection;

  constructor(
    nodes: Array<INode<T>>,
    comparator: (one: T, two: T) => number,
    direction = "ASC" as HeapDirection
  ) {
    this.comparator = comparator;
    this.direction = direction;
    this._initialize(nodes);
  }

  insert(node: INode<T>): void {
    if (!this._hasData(node)) {
      return;
    }

    this.nodes.push(node);

    let index = this.nodes.length - 1;
    let parent = this._getParent(index);
    while (index > 0 && this._shouldSwap(parent, index)) {
      this._swap(parent, index);
      index = parent;
      parent = this._getParent(index);
    }
  }

  remove(): INode<T> | null {
    if (this.nodes.length === 0) return null;
    this._swap(0, this.nodes.length - 1);
    const node = this.nodes.pop();

    let index = 0;
    let childOne = this._getFirstChild(index);
    let childTwo = this._getSecondChild(index);
    let childIndexToSwap =
      this.nodes[childTwo] && this._shouldSwap(childOne, childTwo)
        ? childTwo
        : childOne;

    while (
      childIndexToSwap < this.nodes.length &&
      this._shouldSwap(index, childIndexToSwap)
    ) {
      this._swap(index, childIndexToSwap);
      index = childIndexToSwap;
      childOne = this._getFirstChild(index);
      childTwo = this._getSecondChild(index);
      childIndexToSwap =
        this.nodes[childTwo] && this._shouldSwap(childOne, childTwo)
          ? childTwo
          : childOne;
    }

    return node;
  }

  _initialize(nodes?: Array<INode<T>>) {
    if (!nodes || nodes.length === 0) {
      this.nodes = [] as Array<INode<T>>;
    }

    for (const node of nodes) {
      this.insert(node);
    }
  }

  _hasData(node: INode<T>): boolean {
    return node && !!node.data;
  }

  _getParent(index: number): number {
    return Math.trunc((index - 1) / 2);
  }

  _getFirstChild(index: number): number {
    return index * 2 + 1;
  }

  _getSecondChild(index: number): number {
    return index * 2 + 2;
  }

  _lessThan(one: number, two: number): boolean {
    return this.comparator(this.nodes[one].data, this.nodes[two].data) < 0;
  }

  _greaterThan(one: number, two: number): boolean {
    return this.comparator(this.nodes[one].data, this.nodes[two].data) > 0;
  }

  _shouldSwap(lower: number, higher: number): boolean {
    return (
      (this._greaterThan(lower, higher) && this.direction === "ASC") ||
      (this._lessThan(lower, higher) && this.direction === "DESC")
    );
  }

  _swap(one: number, two: number): void {
    if (one === two) return;
    const oneCopy: INode<T> = this.nodes[one];
    this.nodes[one] = this.nodes[two];
    this.nodes[two] = oneCopy;
  }
}

export function mergeSortAsc<U>(
  contentLists: U[][],
  comparator: (one: U[], two: U[]) => number,
  finalResultSize?: number
): {
  data: U[];
  [k: string]: any;
} {
  const contentsAsNodes: Array<INode<U[]>> = contentLists.map(
    (list, index) => ({ data: list, label: index.toString() })
  );
  const heap: BinaryHeap<U[]> = new BinaryHeap<U[]>(
    contentsAsNodes,
    comparator
  );
  return heapKMerge(heap, finalResultSize);
}

export function mergeSortDesc<U>(
  contentLists: U[][],
  comparator: (one: U[], two: U[]) => number,
  finalResultSize?: number
): {
  data: U[];
  [k: string]: any;
} {
  const contentsAsNodes: Array<INode<U[]>> = contentLists.map(
    (list, index) => ({ data: list, label: index.toString() })
  );
  const heap: BinaryHeap<U[]> = new BinaryHeap<U[]>(
    contentsAsNodes,
    comparator,
    "DESC"
  );
  return heapKMerge(heap, finalResultSize);
}

function heapKMerge<V>(
  heap: IBinaryHeap<V[]>,
  finalResultSize?: number
): {
  data: V[];
  [k: string]: any;
} {
  let currResultSize: number = 0;
  let node: INode<V[]> = heap.remove();

  const data: V[] = [];
  const results: any = {
    data
  };

  while ((!finalResultSize || currResultSize <= finalResultSize) && node) {
    if (node.data.length === 0) {
      node = heap.remove();
      continue;
    }

    results.data.push(node.data[0]);
    if (!results[node.label]) {
      results[node.label] = 0;
    }
    results[node.label]++;
    currResultSize++;

    node.data = node.data.splice(0, 1);
    if (node.data.length) {
      heap.insert(node);
    }

    node = heap.remove();
  }

  return results;
}
