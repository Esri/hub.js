interface INode<T> {
  data: T[];
  labelKey: string;
}

class ListMinHeap<T> {
  nodes: Array<INode<T>>;
  comparator: (one: T[], two: T[]) => number;

  constructor(
    nodes: Array<INode<T>>,
    comparator: (one: T[], two: T[]) => number
  ) {
    this._initialize(nodes);
    this.comparator = comparator;
  }

  insert(node: INode<T>): void {
    this.nodes.push(node);

    let nodeIndex = this.nodes.length - 1;
    let parentIndex = (nodeIndex - 1) / 2;
    while (
      nodeIndex > 0 &&
      this.comparator(
        this.nodes[nodeIndex].data,
        this.nodes[parentIndex].data
      ) < 0
    ) {
      this._swap(nodeIndex, parentIndex);
      nodeIndex = parentIndex;
      parentIndex = (nodeIndex - 1) / 2;
    }
  }

  removeMin(): INode<T> | null {
    if (this.nodes.length <= 1) return null;
    this._swap(0, this.nodes.length - 1);
    this.nodes.pop();

    let nodeIndex = 0;
    let childIndexOne = nodeIndex * 2 + 1;
    let childIndexTwo = nodeIndex * 2 + 2;

    while (
      childIndexOne < this.nodes.length &&
      this.comparator(
        this.nodes[nodeIndex].data,
        this.nodes[childIndexOne].data
      ) > 0
    ) {
      let childIndexToSwap = childIndexOne;
      if (
        childIndexTwo &&
        this.comparator(
          this.nodes[childIndexOne].data,
          this.nodes[childIndexTwo].data
        ) > 0
      ) {
        childIndexToSwap = childIndexTwo;
      }
      this._swap(nodeIndex, childIndexToSwap);
      nodeIndex = childIndexToSwap;
      childIndexOne = nodeIndex * 2 + 1;
      childIndexTwo = nodeIndex * 2 + 2;
    }
  }

  _initialize(nodes?: Array<INode<T>>) {
    if (!nodes || nodes.length === 0) {
      this.nodes = [] as Array<INode<T>>;
    }

    for (const node of nodes) {
      this.insert(node);
    }
  }

  _swap(one: number, two: number): void {
    const oneCopy: INode<T> = this.nodes[one];
    this.nodes[one] = this.nodes[two];
    this.nodes[two] = oneCopy;
  }
}

export function kMerge<T>(
  contentLists: T[][],
  comparator: (one: T[], two: T[]) => number,
  finalResultSize = 10
) {
  const contentsAsNodes = contentLists.map(
    (list, index) => ({ data: list, labelKey: index.toString() } as INode<T>)
  );
  const heap: ListMinHeap<T> = new ListMinHeap<T>(contentsAsNodes, comparator);

  let currResultSize: number = 0;
  let minNode: INode<T> = heap.removeMin();

  const data: T[] = [];
  const results: any = {
    data
  };

  while (currResultSize <= finalResultSize && minNode) {
    results.data.push(minNode.data[0]);
    results[minNode.labelKey]++;
    currResultSize++;

    minNode.data = minNode.data.splice(0, 1);
    if (minNode.data.length) {
      heap.insert(minNode);
    }

    minNode = heap.removeMin();
  }

  return results;
}
