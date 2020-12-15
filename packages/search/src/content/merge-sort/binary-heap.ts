interface INode<T> {
  data: T;
  label: string;
}

interface IBinaryHeap<T> {
  insert(node: INode<T>): void;
  remove(): INode<T> | null;
}

type comparator<T> = (one: T, two: T) => number;

type HeapDirection = "ASC" | "DESC";

export class BinaryHeap<T> implements IBinaryHeap<T> {
  private _nodes: Array<INode<T>>;
  private readonly _comparator: comparator<T>;
  private readonly _direction: HeapDirection;

  constructor(
    nodes: Array<INode<T>>,
    cmptr: comparator<T>,
    direction = "ASC" as HeapDirection
  ) {
    this._validate({ cmptr, direction });
    this._comparator = cmptr;
    this._direction = direction;
    this._initialize(nodes);
  }

  insert(node: INode<T>): void {
    if (!this._hasData(node)) {
      return;
    }

    this._nodes.push(node);

    let currIndex = this._nodes.length - 1;
    let parentIndex = this._getParentIndex(currIndex);
    while (this._shouldSwap(parentIndex, currIndex)) {
      this._swap(parentIndex, currIndex);
      currIndex = parentIndex;
      parentIndex = this._getParentIndex(currIndex);
    }
  }

  remove(): INode<T> | null {
    if (this._nodes.length === 0) return null;
    this._swap(0, this._nodes.length - 1);
    const node = this._nodes.pop();
    this._reindexLastNode();
    return node;
  }

  length(): number {
    return this._nodes.length;
  }

  heap(): ReadonlyArray<INode<T>> {
    return this._nodes as ReadonlyArray<INode<T>>;
  }

  private _initialize(nodes: Array<INode<T>>) {
    this._nodes = [];

    if (!nodes || nodes.length === 0) {
      return;
    }

    for (const node of nodes) {
      this.insert(node);
    }
  }

  private _reindexLastNode() {
    let index = 0;
    let [childOne, childTwo] = this._getChildIndices(index);
    let childIndexToSwap = this._shouldSwap(childOne, childTwo)
      ? childTwo
      : childOne;

    while (
      !this._isInvalidIndex(childIndexToSwap) &&
      this._shouldSwap(index, childIndexToSwap)
    ) {
      this._swap(index, childIndexToSwap);
      index = childIndexToSwap;
      [childOne, childTwo] = this._getChildIndices(index);
      childIndexToSwap = this._shouldSwap(childOne, childTwo)
        ? childTwo
        : childOne;
    }
  }

  private _getParentIndex(index: number): number {
    return Math.trunc((index - 1) / 2);
  }

  private _getChildIndices(index: number): [number, number] {
    return [index * 2 + 1, index * 2 + 2];
  }

  private _shouldSwap(lowerIndex: number, higherIndex: number): boolean {
    if (this._isInvalidIndex(lowerIndex) || this._isInvalidIndex(higherIndex)) {
      return false;
    }

    return (
      (this._greaterThan(lowerIndex, higherIndex) &&
        this._direction === "ASC") ||
      (this._lessThan(lowerIndex, higherIndex) && this._direction === "DESC")
    );
  }

  private _isInvalidIndex(index: number): boolean {
    return index < 0 || index >= this._nodes.length;
  }

  private _lessThan(lowerIndex: number, higherIndex: number): boolean {
    return (
      this._comparator(
        this._nodes[lowerIndex].data,
        this._nodes[higherIndex].data
      ) < 0
    );
  }

  private _greaterThan(lowerIndex: number, higherIndex: number): boolean {
    return (
      this._comparator(
        this._nodes[lowerIndex].data,
        this._nodes[higherIndex].data
      ) > 0
    );
  }

  private _hasData(node: INode<T>): boolean {
    return node && !!node.data;
  }

  private _swap(one: number, two: number): void {
    if (one === two) return;
    const oneCopy: INode<T> = this._nodes[one];
    this._nodes[one] = this._nodes[two];
    this._nodes[two] = oneCopy;
  }

  private _validate(args: any) {
    if (!args.cmptr) {
      throw new Error("Comparator function must be defined");
    }

    if (!args.direction) {
      throw new Error("Provided heap direction is invalid");
    }
  }
}
