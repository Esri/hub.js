import { BinaryHeap, INode } from "../../../src/search/helpers/sort-results";

describe("Min Binary Heap", () => {
  it("should be able to be created correctly, with proper insertion and removal of data", () => {
    // Setup
    const first = { data: [2, 4, 9, 10, 11, 12], label: "0" };
    const second = { data: [1, 8, 10, 22], label: "1" };

    const lists = [first, second];

    const comparator = (one: number[], two: number[]): number => {
      if (one.length === 0) return two[0] ? 1 : 0;
      if (two.length === 0) return one[0] ? -1 : 0;
      return one[0] - two[0];
    };

    const minHeap: BinaryHeap<number[]> = new BinaryHeap(lists, comparator);

    // Assertions
    // Assert minHeap has two nodes and they are in the correct order
    expect(minHeap).toBeDefined();
    expect(minHeap.nodes.length).toEqual(2);
    expect(minHeap.nodes[0]).toEqual(second);
    expect(minHeap.nodes[1]).toEqual(first);

    // Assert that more nodes can be added and processed in proper order
    const third = { data: [-4, 0], label: "2" } as INode<number[]>;

    minHeap.insert(third);
    expect(minHeap.nodes.length).toEqual(3);
    expect(minHeap.nodes[0]).toEqual(third);
    expect(minHeap.nodes[1]).toEqual(first);
    expect(minHeap.nodes[2]).toEqual(second);

    // Assert that empty data array IS valid as data is not falsey
    const fourth = { data: [], label: "3" } as INode<number[]>;

    minHeap.insert(fourth);
    expect(minHeap.nodes.length).toEqual(4);
    expect(minHeap.nodes[0]).toEqual(third);
    expect(minHeap.nodes[1]).toEqual(first);
    expect(minHeap.nodes[2]).toEqual(second);
    expect(minHeap.nodes[3]).toEqual(fourth);

    // Assert that null data IS NOT valid as data is falsey
    const fifth = { data: null, label: "4" } as INode<number[]>;

    minHeap.insert(fifth);
    expect(minHeap.nodes.length).toEqual(4);
    expect(minHeap.nodes[0]).toEqual(third);
    expect(minHeap.nodes[1]).toEqual(first);
    expect(minHeap.nodes[2]).toEqual(second);
    expect(minHeap.nodes[3]).toEqual(fourth);

    // Assert that data is removed in correct order
    const removedOne = minHeap.remove();
    expect(removedOne).toEqual(third);

    const removedTwo = minHeap.remove();
    expect(removedTwo).toEqual(second);

    const removedThree = minHeap.remove();
    expect(removedThree).toEqual(first);

    const removedFour = minHeap.remove();
    expect(removedFour).toEqual(fourth);

    const removedFive = minHeap.remove();
    expect(removedFive).toEqual(null);

    const removedSix = minHeap.remove();
    expect(removedSix).toEqual(null);
  });

  it("should be able to be created with more than 2 nodes", () => {
    // Setup
    const first = { data: "r string", label: "0" };
    const second = { data: "b string ", label: "1" };
    const third = { data: "z string ", label: "2" };
    const fourth = { data: "s string ", label: "3" };
    const fifth = { data: "a string ", label: "4" };
    const sixth = { data: "k string ", label: "5" };
    const seventh = { data: "y string ", label: "6" };
    const eighth = { data: "i string ", label: "8" };
    const nineth = { data: "d string ", label: "9" };
    const tenth = { data: "t string ", label: "10" };

    const lists = [
      first,
      second,
      third,
      fourth,
      fifth,
      sixth,
      seventh,
      eighth,
      nineth,
      tenth
    ];

    const comparator = (one: string, two: string): number => {
      if (one.length === 0) return two.length > 0 ? 1 : 0;
      if (two.length === 0) return one.length > 0 ? -1 : 0;
      return one.localeCompare(two);
    };

    const minHeap: BinaryHeap<string> = new BinaryHeap(lists, comparator);

    // Assertions
    // Assert minHeap has 10 nodes and they are in the correct order
    expect(minHeap).toBeDefined();
    expect(minHeap.nodes.length).toEqual(10);
    expect(minHeap.nodes[0]).toEqual(fifth);
    expect(minHeap.nodes[1]).toEqual(second);
    expect(minHeap.nodes[2]).toEqual(sixth);
    expect(minHeap.nodes[3]).toEqual(nineth);
    expect(minHeap.nodes[4]).toEqual(first);
    expect(minHeap.nodes[5]).toEqual(third);
    expect(minHeap.nodes[6]).toEqual(seventh);
    expect(minHeap.nodes[7]).toEqual(fourth);
    expect(minHeap.nodes[8]).toEqual(eighth);
    expect(minHeap.nodes[9]).toEqual(tenth);

    // Assert minHeap insertions are correct
    minHeap.insert(third);
    expect(minHeap.nodes.length).toEqual(11);
    expect(minHeap.nodes[0]).toEqual(fifth);
    expect(minHeap.nodes[1]).toEqual(second);
    expect(minHeap.nodes[2]).toEqual(sixth);
    expect(minHeap.nodes[3]).toEqual(nineth);
    expect(minHeap.nodes[4]).toEqual(first);
    expect(minHeap.nodes[5]).toEqual(third);
    expect(minHeap.nodes[6]).toEqual(seventh);
    expect(minHeap.nodes[7]).toEqual(fourth);
    expect(minHeap.nodes[8]).toEqual(eighth);
    expect(minHeap.nodes[9]).toEqual(tenth);
    expect(minHeap.nodes[10]).toEqual(third);

    minHeap.insert(fifth);
    expect(minHeap.nodes.length).toEqual(12);
    expect(minHeap.nodes[0]).toEqual(fifth);
    expect(minHeap.nodes[1]).toEqual(second);
    expect(minHeap.nodes[2]).toEqual(fifth);
    expect(minHeap.nodes[3]).toEqual(nineth);
    expect(minHeap.nodes[4]).toEqual(first);
    expect(minHeap.nodes[5]).toEqual(sixth);
    expect(minHeap.nodes[6]).toEqual(seventh);
    expect(minHeap.nodes[7]).toEqual(fourth);
    expect(minHeap.nodes[8]).toEqual(eighth);
    expect(minHeap.nodes[9]).toEqual(tenth);
    expect(minHeap.nodes[10]).toEqual(third);
    expect(minHeap.nodes[11]).toEqual(third);

    // Assert that data is removed in correct order
    const removedOne = minHeap.remove();
    expect(removedOne).toEqual(fifth);

    const removedTwo = minHeap.remove();
    expect(removedTwo).toEqual(fifth);

    const removedThree = minHeap.remove();
    expect(removedThree).toEqual(second);

    const removedFour = minHeap.remove();
    expect(removedFour).toEqual(nineth);

    const removedFive = minHeap.remove();
    expect(removedFive).toEqual(eighth);

    const removedSix = minHeap.remove();
    expect(removedSix).toEqual(sixth);

    const removedSeven = minHeap.remove();
    expect(removedSeven).toEqual(first);

    const removedEigth = minHeap.remove();
    expect(removedEigth).toEqual(fourth);

    const removedNine = minHeap.remove();
    expect(removedNine).toEqual(tenth);

    const removedTen = minHeap.remove();
    expect(removedTen).toEqual(seventh);

    const removedEleven = minHeap.remove();
    expect(removedEleven).toEqual(third);

    const removedTwelve = minHeap.remove();
    expect(removedTwelve).toEqual(third);
  });
});

describe("Max Binary Heap", () => {
  it("should be able to be created correctly, with proper insertion and removal of data", () => {
    // Setup
    const first = { data: [2, 4, 9, 10, 11, 12], label: "0" };
    const second = { data: [1, 8, 10, 22], label: "1" };

    const lists = [first, second];

    const comparator = (one: number[], two: number[]): number => {
      if (one.length === 0) return two[0] ? -1 : 0;
      if (two.length === 0) return one[0] ? 1 : 0;
      return one[0] - two[0];
    };

    const maxHeap: BinaryHeap<number[]> = new BinaryHeap(
      lists,
      comparator,
      "DESC"
    );

    // Assertions
    // Assert minHeap has two nodes and they are in the correct order
    expect(maxHeap).toBeDefined();
    expect(maxHeap.nodes.length).toEqual(2);
    expect(maxHeap.nodes[0]).toEqual(first);
    expect(maxHeap.nodes[1]).toEqual(second);

    // Assert that more nodes can be added and processed in proper order
    const third = { data: [-4, 0], label: "2" } as INode<number[]>;

    maxHeap.insert(third);
    expect(maxHeap.nodes.length).toEqual(3);
    expect(maxHeap.nodes[0]).toEqual(first);
    expect(maxHeap.nodes[1]).toEqual(second);
    expect(maxHeap.nodes[2]).toEqual(third);

    // Assert that empty data array IS valid as data is not falsey
    const fourth = { data: [], label: "3" } as INode<number[]>;

    maxHeap.insert(fourth);
    expect(maxHeap.nodes.length).toEqual(4);
    expect(maxHeap.nodes[0]).toEqual(first);
    expect(maxHeap.nodes[1]).toEqual(second);
    expect(maxHeap.nodes[2]).toEqual(third);
    expect(maxHeap.nodes[3]).toEqual(fourth);

    // Assert that null data IS NOT valid as data is falsey
    const fifth = { data: null, label: "4" } as INode<number[]>;

    maxHeap.insert(fifth);
    expect(maxHeap.nodes.length).toEqual(4);
    expect(maxHeap.nodes[0]).toEqual(first);
    expect(maxHeap.nodes[1]).toEqual(second);
    expect(maxHeap.nodes[2]).toEqual(third);
    expect(maxHeap.nodes[3]).toEqual(fourth);

    // Assert that data is removed in correct order
    const removedOne = maxHeap.remove();
    expect(removedOne).toEqual(first);

    const removedTwo = maxHeap.remove();
    expect(removedTwo).toEqual(second);

    const removedThree = maxHeap.remove();
    expect(removedThree).toEqual(third);

    const removedFour = maxHeap.remove();
    expect(removedFour).toEqual(fourth);

    const removedFive = maxHeap.remove();
    expect(removedFive).toEqual(null);

    const removedSix = maxHeap.remove();
    expect(removedSix).toEqual(null);
  });

  it("should be able to be created with more than 2 nodes", () => {
    // Setup
    const first = { data: "r string", label: "0" };
    const second = { data: "b string ", label: "1" };
    const third = { data: "z string ", label: "2" };
    const fourth = { data: "s string ", label: "3" };
    const fifth = { data: "a string ", label: "4" };
    const sixth = { data: "k string ", label: "5" };
    const seventh = { data: "y string ", label: "6" };
    const eighth = { data: "i string ", label: "8" };
    const nineth = { data: "d string ", label: "9" };
    const tenth = { data: "t string ", label: "10" };

    const lists = [
      first,
      second,
      third,
      fourth,
      fifth,
      sixth,
      seventh,
      eighth,
      nineth,
      tenth
    ];

    const comparator = (one: string, two: string): number => {
      if (one.length === 0) return two.length > 0 ? 1 : 0;
      if (two.length === 0) return one.length > 0 ? -1 : 0;
      return one.localeCompare(two);
    };

    const maxHeap: BinaryHeap<string> = new BinaryHeap(
      lists,
      comparator,
      "DESC"
    );

    // Assertions
    // Assert maxHeap has 10 nodes and they are in the correct order
    expect(maxHeap).toBeDefined();
    expect(maxHeap.nodes.length).toEqual(10);
    expect(maxHeap.nodes[0]).toEqual(third);
    expect(maxHeap.nodes[1]).toEqual(tenth);
    expect(maxHeap.nodes[2]).toEqual(seventh);
    expect(maxHeap.nodes[3]).toEqual(eighth);
    expect(maxHeap.nodes[4]).toEqual(fourth);
    expect(maxHeap.nodes[5]).toEqual(sixth);
    expect(maxHeap.nodes[6]).toEqual(first);
    expect(maxHeap.nodes[7]).toEqual(second);
    expect(maxHeap.nodes[8]).toEqual(nineth);
    expect(maxHeap.nodes[9]).toEqual(fifth);

    // Assert maxHeap insertions are correct
    maxHeap.insert(third);
    expect(maxHeap.nodes.length).toEqual(11);
    expect(maxHeap.nodes[0]).toEqual(third);
    expect(maxHeap.nodes[1]).toEqual(third);
    expect(maxHeap.nodes[2]).toEqual(seventh);
    expect(maxHeap.nodes[3]).toEqual(eighth);
    expect(maxHeap.nodes[4]).toEqual(tenth);
    expect(maxHeap.nodes[5]).toEqual(sixth);
    expect(maxHeap.nodes[6]).toEqual(first);
    expect(maxHeap.nodes[7]).toEqual(second);
    expect(maxHeap.nodes[8]).toEqual(nineth);
    expect(maxHeap.nodes[9]).toEqual(fifth);
    expect(maxHeap.nodes[10]).toEqual(fourth);

    maxHeap.insert(fifth);
    expect(maxHeap.nodes.length).toEqual(12);
    expect(maxHeap.nodes[0]).toEqual(third);
    expect(maxHeap.nodes[1]).toEqual(third);
    expect(maxHeap.nodes[2]).toEqual(seventh);
    expect(maxHeap.nodes[3]).toEqual(eighth);
    expect(maxHeap.nodes[4]).toEqual(tenth);
    expect(maxHeap.nodes[5]).toEqual(sixth);
    expect(maxHeap.nodes[6]).toEqual(first);
    expect(maxHeap.nodes[7]).toEqual(second);
    expect(maxHeap.nodes[8]).toEqual(nineth);
    expect(maxHeap.nodes[9]).toEqual(fifth);
    expect(maxHeap.nodes[10]).toEqual(fourth);
    expect(maxHeap.nodes[11]).toEqual(fifth);

    // Assert that data is removed in correct order
    const removedOne = maxHeap.remove();
    expect(removedOne).toEqual(third);

    const removedTwo = maxHeap.remove();
    expect(removedTwo).toEqual(third);

    const removedThree = maxHeap.remove();
    expect(removedThree).toEqual(seventh);

    const removedFour = maxHeap.remove();
    expect(removedFour).toEqual(tenth);

    const removedFive = maxHeap.remove();
    expect(removedFive).toEqual(fourth);

    const removedSix = maxHeap.remove();
    expect(removedSix).toEqual(first);

    const removedSeven = maxHeap.remove();
    expect(removedSeven).toEqual(sixth);

    const removedEigth = maxHeap.remove();
    expect(removedEigth).toEqual(eighth);

    const removedNine = maxHeap.remove();
    expect(removedNine).toEqual(nineth);

    const removedTen = maxHeap.remove();
    expect(removedTen).toEqual(second);

    const removedEleven = maxHeap.remove();
    expect(removedEleven).toEqual(fifth);

    const removedTwelve = maxHeap.remove();
    expect(removedTwelve).toEqual(fifth);
  });
});
