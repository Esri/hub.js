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

/**
 * k-way merge implementation that merges (and potentially sorts) k individually sorted arrays
 * based on the k-way merge algorithm (https://en.wikipedia.org/wiki/K-way_merge_algorithm)
 *
 * If a comparator function used to compare data is provided, a k-way merge sort is performed using
 * a Binary Heap implementation. Otherwise data from each input array is merged incrementally
 *
 * The returned object contains merged (and potentially sorted) data, as well as key-value
 * pairs that represent the index of a result set in the "data" parameter (the key) tied to how
 * many results (the value) of that result set were added to the final merged data array.
 * For example, if "data" represents an array of two result sets, with 3 and 5 results added to the final
 * result set, respectively, the returned object would be { data: [...], "0": 3, "1": 5 }
 *
 * @param data An array of of result sets, each an array of type T
 * @param resultLimit the maximum number of merged results to return, defaults to 10
 * @param cmptr comparator function that takes in two instances of type T and returns a negative number if a is less than b, a positive if a is greater than b, 0 if equal
 * @param direction specifies whether data should be ordered ascending or descending
 * @returns list of results and key-value pairs indicating how many from each were added to returned data
 */
export function kMerge<T>(
  data: T[][],
  resultLimit: number = 10,
  cmptr?: comparator<T[]>,
  direction?: HeapDirection
): { data: T[]; [key: string]: any } {
  const results = cmptr
    ? kMergeSort(data, cmptr, direction, resultLimit)
    : kMergeDefault(data, resultLimit);

  // Zero-fill any result set that did not have any results added to final
  for (let i = 0; i < data.length; i++) {
    if (!results[i.toString()]) {
      results[i.toString()] = 0;
    }
  }

  return results;
}

function kMergeDefault<T>(
  data: T[][],
  resultLimit: number
): { data: T[]; [key: string]: any } {
  const results: { data: T[]; [key: string]: any } = {
    data: [] as T[]
  };

  let totalDataRemaining: number = _getRemainingResults(data);

  while (
    !_hasReachedLimit(results.data.length, resultLimit) &&
    totalDataRemaining > 0
  ) {
    const dataToAdd: T[] = [];
    data.forEach((dataArr, index) => {
      if (
        dataArr.length > 0 &&
        _canDataBeAdded(dataToAdd, results.data, resultLimit)
      ) {
        results[index.toString()] = results[index.toString()]
          ? results[index.toString()] + 1
          : 1;
        dataToAdd.push(dataArr.splice(0, 1)[0]);
      }
    });

    results.data.push(...dataToAdd);
    totalDataRemaining = _getRemainingResults(data);
  }

  return results;
}

function kMergeSort<T>(
  data: T[][],
  cmptr: comparator<T[]>,
  direction: HeapDirection,
  resultLimit: number
): { data: T[]; [key: string]: any } {
  const nodes: Array<INode<T[]>> = data.map(
    (datum, index) => ({ data: datum, label: index.toString() } as INode<T[]>)
  );
  const heap: BinaryHeap<T[]> = new BinaryHeap<T[]>(nodes, cmptr, direction);

  const results: { data: T[]; [key: string]: any } = {
    data: [] as T[]
  };

  while (results.data.length < resultLimit && heap.length() > 0) {
    const node = heap.remove();

    if (node.data.length > 0) {
      results[node.label] = results[node.label] ? results[node.label] + 1 : 1;
      results.data.push(node.data.splice(0, 1)[0]);
      heap.insert(node);
    }
  }

  return results;
}

function _getRemainingResults(data: unknown[][]): number {
  return data.reduce((length, arr) => {
    return length + arr.length;
  }, 0);
}

function _hasReachedLimit(results: number, resultLimit: number): boolean {
  return results - resultLimit >= 0;
}

function _canDataBeAdded(
  dataToAdd: unknown[],
  resultsAdded: unknown[],
  resultLimit: number
) {
  return resultsAdded.length + dataToAdd.length < resultLimit;
}

/**
 * Binary Heap Implementation that implements the 'insert' and 'remove' methods
 * of the IBinaryHeap interface. Example use is for k-way merge sorting of k sorted arrays.
 * Performance is O(n log n) for initialization (could be further optimized), O(log n) for insertion and O(log n) for deletion
 *
 * @param nodes An array of INode objects of type T. If undefined or null are explicitly provided it defaults to empty array
 * @param cmptr comparator function that takes in two instances of type T and returns a number to determine sorting order
 * @param direction A HeapDirection that determines if heap should be min ("ASC") or max ("DESC") implementation
 */
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

  /**
   * Inserts node into binary heap
   * @param node
   */
  public insert(node: INode<T>): void {
    if (!this._hasData(node)) {
      return;
    }

    this._nodes.push(node);

    let currIndex = this.length() - 1;
    let parentIndex = this._getParentIndex(currIndex);
    while (this._shouldSwap(parentIndex, currIndex)) {
      this._swap(parentIndex, currIndex);
      currIndex = parentIndex;
      parentIndex = this._getParentIndex(currIndex);
    }
  }

  /**
   * Removes either the minimum or the maximum node, depending on heap implementation
   * @returns the min/max node or null if heap is empty.
   */
  remove(): INode<T> | null {
    if (this.length() === 0) return null;
    this._swap(0, this.length() - 1);
    const node = this._nodes.pop();
    this._siftDown(0);
    return node;
  }

  /**
   * Returns number of nodes in heap
   * @returns number of nodes
   */
  length(): number {
    return this._nodes.length;
  }

  /**
   * Returns a readonly version of the heap as an array
   * @returns Readonly array representation of the heap
   */
  heap(): ReadonlyArray<INode<T>> {
    return this._nodes as ReadonlyArray<INode<T>>;
  }

  private _initialize(nodes: Array<INode<T>>): void {
    this._nodes = [];

    if (!nodes || nodes.length === 0) {
      return;
    }

    for (const node of nodes) {
      this.insert(node);
    }
  }

  private _siftDown(index: number): void {
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
    return index < 0 || index >= this.length();
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
    return node && node.data !== undefined && node.data !== null;
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
