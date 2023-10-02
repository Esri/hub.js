import { lorem, date, datatype } from "faker";
import { BinaryHeap, kMerge } from "../../../src/util/merge-sort/merge";

describe("Binary Heap", () => {
  it("should successfully initialize if falsey nodes are explicitly provided", () => {
    // Setup
    const comparator = (one: number[], two: number[]): number => {
      if (one.length === 0) return two[0] ? 1 : 0;
      if (two.length === 0) return one[0] ? -1 : 0;
      return one[0] - two[0];
    };

    // Test
    const minHeapOne: BinaryHeap<number[]> = new BinaryHeap(null, comparator);
    const minHeapTwo: BinaryHeap<number[]> = new BinaryHeap(
      undefined,
      comparator
    );

    // Assertions
    expect(minHeapOne).toBeDefined();
    expect(minHeapOne.length()).toEqual(0);
    expect(minHeapTwo).toBeDefined();
    expect(minHeapTwo.length()).toEqual(0);
  });

  it("should fail to initialize if falsey comparators are explicitly provided", () => {
    // Setup
    let heap: BinaryHeap<string>;

    // Test
    try {
      heap = new BinaryHeap(null, undefined);
    } catch (err) {
      expect(err.message).toEqual("Comparator function must be defined");
    }

    try {
      heap = new BinaryHeap(null, null);
    } catch (err) {
      expect(err.message).toEqual("Comparator function must be defined");
    }
  });

  it("should fail to initialize if falsey heap direction is explicitly provided", () => {
    // Setup
    const comparator = (one: number[], two: number[]): number => {
      if (one.length === 0) return two[0] ? 1 : 0;
      if (two.length === 0) return one[0] ? -1 : 0;
      return one[0] - two[0];
    };

    let heap: BinaryHeap<number[]>;

    // Test
    try {
      heap = new BinaryHeap(null, comparator, undefined);
    } catch (err) {
      expect(err.message).toEqual("Provided heap direction is invalid");
    }

    try {
      heap = new BinaryHeap(null, comparator, null);
    } catch (err) {
      expect(err.message).toEqual("Provided heap direction is invalid");
    }
  });
});

describe("Min Binary Heap", () => {
  it("should be created correctly, with proper insertion and removal of data", () => {
    // Setup
    const first = { data: [2, 4, 9, 10, 11, 12], label: "0" };
    const second = { data: [1, 8, 10, 22], label: "1" };

    const lists = [first, second];

    const comparator = (one: number[], two: number[]): number => {
      if (one.length === 0) return two[0] ? 1 : 0;
      if (two.length === 0) return one[0] ? -1 : 0;
      return one[0] - two[0];
    };

    // Test
    const minHeap: BinaryHeap<number[]> = new BinaryHeap(lists, comparator);

    // Assertions
    // Assert minHeap has two nodes and they are in the correct order
    expect(minHeap).toBeDefined();
    expect(minHeap.length()).toEqual(2);
    expect(minHeap.heap()).toEqual([second, first]);

    // Assert that more nodes can be added and processed in proper order
    const third = { data: [-4, 0], label: "2" };

    minHeap.insert(third);
    expect(minHeap.length()).toEqual(3);
    expect(minHeap.heap()).toEqual([third, first, second]);

    // Assert that empty data array IS valid as data is not falsey
    const fourth = { data: [] as number[], label: "3" };

    minHeap.insert(fourth);
    expect(minHeap.length()).toEqual(4);
    expect(minHeap.heap()).toEqual([third, first, second, fourth]);

    // Assert that null data IS NOT valid as data is falsey
    const fifth = { data: null as number[], label: "4" };

    minHeap.insert(fifth);
    expect(minHeap.length()).toEqual(4);
    expect(minHeap.heap()).toEqual([third, first, second, fourth]);

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
    const ninth = { data: "d string ", label: "9" };
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
      ninth,
      tenth,
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
    expect(minHeap.length()).toEqual(10);
    expect(minHeap.heap()).toEqual([
      fifth,
      second,
      sixth,
      ninth,
      first,
      third,
      seventh,
      fourth,
      eighth,
      tenth,
    ]);

    // Assert minHeap insertions are correct
    minHeap.insert(third);
    expect(minHeap.length()).toEqual(11);
    expect(minHeap.heap()).toEqual([
      fifth,
      second,
      sixth,
      ninth,
      first,
      third,
      seventh,
      fourth,
      eighth,
      tenth,
      third,
    ]);

    minHeap.insert(fifth);
    expect(minHeap.length()).toEqual(12);
    expect(minHeap.heap()).toEqual([
      fifth,
      second,
      fifth,
      ninth,
      first,
      sixth,
      seventh,
      fourth,
      eighth,
      tenth,
      third,
      third,
    ]);

    // Assert that data is removed in correct order
    const removedOne = minHeap.remove();
    expect(removedOne).toEqual(fifth);

    const removedTwo = minHeap.remove();
    expect(removedTwo).toEqual(fifth);

    const removedThree = minHeap.remove();
    expect(removedThree).toEqual(second);

    const removedFour = minHeap.remove();
    expect(removedFour).toEqual(ninth);

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

  it("should be able to properly sort randomized strings", () => {
    // Setup
    const sortFunc = (
      one: { data: string; label: string },
      two: { data: string; label: string }
    ) => one.data.localeCompare(two.data);
    const randomizer = (_v: unknown, _i: number, _a: unknown[]) => ({
      data: lorem.word(),
      label: lorem.word(),
    });

    const input: Array<{ data: string; label: string }> = Array.apply(
      null,
      Array(30)
    ).map(randomizer);
    const expected: string[] = [...input]
      .sort(sortFunc)
      .map((node) => node.data);

    // Test
    const cmptr = (one: string, two: string) => one.localeCompare(two);
    const heap: BinaryHeap<string> = new BinaryHeap<string>(input, cmptr);
    const actual: string[] = [];

    while (heap.length()) {
      actual.push(heap.remove().data);
    }

    // Assert
    expect(expected).toEqual(actual);
  });

  it("should be able to properly sort randomized integers", () => {
    // Setup
    const sortFunc = (
      one: { data: number; label: string },
      two: { data: number; label: string }
    ) => one.data - two.data;
    const randomizer = (_v: unknown, _i: number, _a: unknown[]) => ({
      data: datatype.number(1000),
      label: lorem.word(),
    });

    const input: Array<{ data: number; label: string }> = Array.apply(
      null,
      Array(30)
    ).map(randomizer);
    const expected: number[] = [...input]
      .sort(sortFunc)
      .map((node) => node.data);

    // Test
    const cmptr = (one: number, two: number) => one - two;
    const heap: BinaryHeap<number> = new BinaryHeap<number>(input, cmptr);
    const actual: number[] = [];

    while (heap.length()) {
      actual.push(heap.remove().data);
    }

    // Assert
    expect(expected).toEqual(actual);
  });

  it("should be able to properly sort randomized dates", () => {
    // Setup
    const sortFunc = (
      one: { data: Date; label: string },
      two: { data: Date; label: string }
    ) => one.data.getTime() - two.data.getTime();
    const randomizer = (_v: unknown, _i: number, _a: unknown[]) => ({
      data: date.past(),
      label: lorem.word(),
    });

    const input: Array<{ data: Date; label: string }> = Array.apply(
      null,
      Array(30)
    ).map(randomizer);
    const expected: Date[] = [...input].sort(sortFunc).map((node) => node.data);

    // Test
    const cmptr = (one: Date, two: Date) => one.getTime() - two.getTime();
    const heap: BinaryHeap<Date> = new BinaryHeap<Date>(input, cmptr);
    const actual: Date[] = [];

    while (heap.length()) {
      actual.push(heap.remove().data);
    }

    // Assert
    expect(expected).toEqual(actual);
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
    expect(maxHeap.length()).toEqual(2);
    expect(maxHeap.heap()).toEqual([first, second]);

    // Assert that more nodes can be added and processed in proper order
    const third = { data: [-4, 0], label: "2" };

    maxHeap.insert(third);
    expect(maxHeap.length()).toEqual(3);
    expect(maxHeap.heap()).toEqual([first, second, third]);

    // Assert that empty data array IS valid as data is not falsey
    const fourth = { data: [] as number[], label: "3" };

    maxHeap.insert(fourth);
    expect(maxHeap.length()).toEqual(4);
    expect(maxHeap.heap()).toEqual([first, second, third, fourth]);

    // Assert that null data IS NOT valid as data is falsey
    const fifth = { data: null as number[], label: "4" };

    maxHeap.insert(fifth);
    expect(maxHeap.length()).toEqual(4);
    expect(maxHeap.heap()).toEqual([first, second, third, fourth]);

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
    const ninth = { data: "d string ", label: "9" };
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
      ninth,
      tenth,
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
    expect(maxHeap.length()).toEqual(10);
    expect(maxHeap.heap()).toEqual([
      third,
      tenth,
      seventh,
      eighth,
      fourth,
      sixth,
      first,
      second,
      ninth,
      fifth,
    ]);

    // Assert maxHeap insertions are correct
    maxHeap.insert(third);
    expect(maxHeap.length()).toEqual(11);
    expect(maxHeap.heap()).toEqual([
      third,
      third,
      seventh,
      eighth,
      tenth,
      sixth,
      first,
      second,
      ninth,
      fifth,
      fourth,
    ]);

    maxHeap.insert(fifth);
    expect(maxHeap.length()).toEqual(12);
    expect(maxHeap.heap()).toEqual([
      third,
      third,
      seventh,
      eighth,
      tenth,
      sixth,
      first,
      second,
      ninth,
      fifth,
      fourth,
      fifth,
    ]);

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
    expect(removedNine).toEqual(ninth);

    const removedTen = maxHeap.remove();
    expect(removedTen).toEqual(second);

    const removedEleven = maxHeap.remove();
    expect(removedEleven).toEqual(fifth);

    const removedTwelve = maxHeap.remove();
    expect(removedTwelve).toEqual(fifth);
  });

  it("should be able to properly sort randomized strings", () => {
    // Setup
    const sortFunc = (
      one: { data: string; label: string },
      two: { data: string; label: string }
    ) => two.data.localeCompare(one.data);
    const randomizer = (_v: unknown, _i: number, _a: unknown[]) => ({
      data: lorem.word(),
      label: lorem.word(),
    });

    const input: Array<{ data: string; label: string }> = Array.apply(
      null,
      Array(30)
    ).map(randomizer);
    const expected: string[] = [...input]
      .sort(sortFunc)
      .map((node) => node.data);

    // Test
    const cmptr = (one: string, two: string) => one.localeCompare(two);
    const heap: BinaryHeap<string> = new BinaryHeap<string>(
      input,
      cmptr,
      "DESC"
    );
    const actual: string[] = [];

    while (heap.length()) {
      actual.push(heap.remove().data);
    }

    // Assert
    expect(expected).toEqual(actual);
  });

  it("should be able to properly sort randomized integers", () => {
    // Setup
    const sortFunc = (
      one: { data: number; label: string },
      two: { data: number; label: string }
    ) => two.data - one.data;
    const randomizer = (_v: unknown, _i: number, _a: unknown[]) => ({
      data: datatype.number(1000),
      label: lorem.word(),
    });

    const input: Array<{ data: number; label: string }> = Array.apply(
      null,
      Array(30)
    ).map(randomizer);
    const expected: number[] = [...input]
      .sort(sortFunc)
      .map((node) => node.data);

    // Test
    const cmptr = (one: number, two: number) => one - two;
    const heap: BinaryHeap<number> = new BinaryHeap<number>(
      input,
      cmptr,
      "DESC"
    );
    const actual: number[] = [];

    while (heap.length()) {
      actual.push(heap.remove().data);
    }

    // Assert
    expect(expected).toEqual(actual);
  });

  it("should be able to properly sort randomized dates", () => {
    // Setup
    const sortFunc = (
      one: { data: Date; label: string },
      two: { data: Date; label: string }
    ) => two.data.getTime() - one.data.getTime();
    const randomizer = (_v: unknown, _i: number, _a: unknown[]) => ({
      data: date.past(),
      label: lorem.word(),
    });

    const input: Array<{ data: Date; label: string }> = Array.apply(
      null,
      Array(30)
    ).map(randomizer);
    const expected: Date[] = [...input].sort(sortFunc).map((node) => node.data);

    // Test
    const cmptr = (one: Date, two: Date) => one.getTime() - two.getTime();
    const heap: BinaryHeap<Date> = new BinaryHeap<Date>(input, cmptr, "DESC");
    const actual: Date[] = [];

    while (heap.length()) {
      actual.push(heap.remove().data);
    }

    // Assert
    expect(expected).toEqual(actual);
  });
});

describe("kMerge", () => {
  describe("general behavior", () => {
    it("should be able to handle 0 results sets", () => {
      // Setup
      const data: number[][] = [];

      // Test
      const result: { data: number[]; [key: string]: any } = kMerge(data);

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: [] });
    });

    it("should be able to handle multiple result sets each with 0 results", () => {
      // Setup
      const data: number[][] = [[], [], []];

      // Test
      const result: { data: number[]; [key: string]: any } = kMerge(data);

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: [], "0": 0, "1": 0, "2": 0 });
    });
  });

  describe("unsorted k-way merges", () => {
    it("should be able to handle 1 results set with data and 2 without", () => {
      // Setup
      const fakeArray: number[] = Array.apply(null, Array(15)).map(() =>
        datatype.number()
      );

      const data: number[][] = [[], fakeArray, []];
      const expected = [...fakeArray];

      // Test
      const result: { data: number[]; [key: string]: any } = kMerge(data, 15);

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 0, "1": 15, "2": 0 });
    });

    it("should be able to handle 2 results set with data and 1 without", () => {
      // Setup
      const arrOne: number[] = Array.apply(null, Array(4)).map(() =>
        datatype.number()
      );
      const arrTwo: number[] = Array.apply(null, Array(3)).map(() =>
        datatype.number()
      );

      const data: number[][] = [[], arrOne, arrTwo];
      const expected = [
        arrOne[0],
        arrTwo[0],
        arrOne[1],
        arrTwo[1],
        arrOne[2],
        arrTwo[2],
        arrOne[3],
      ];

      // Test
      const result: { data: number[]; [key: string]: any } = kMerge(data);

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 0, "1": 4, "2": 3 });
    });

    it("should be able to handle 3 results set with data", () => {
      // Setup
      const arrOne: number[] = Array.apply(null, Array(4)).map(() =>
        datatype.number()
      );
      const arrTwo: number[] = Array.apply(null, Array(3)).map(() =>
        datatype.number()
      );
      const arrThree: number[] = Array.apply(null, Array(2)).map(() =>
        datatype.number()
      );

      const data: number[][] = [arrThree, arrOne, arrTwo];
      const expected = [
        arrThree[0],
        arrOne[0],
        arrTwo[0],
        arrThree[1],
        arrOne[1],
        arrTwo[1],
        arrOne[2],
        arrTwo[2],
        arrOne[3],
      ];

      // Test
      const result: { data: number[]; [key: string]: any } = kMerge(data);

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 2, "1": 4, "2": 3 });
    });

    it("should be able to handle limiting the final results", () => {
      // Setup
      const arrOne: number[] = Array.apply(null, Array(4)).map(() =>
        datatype.number()
      );
      const arrTwo: number[] = Array.apply(null, Array(3)).map(() =>
        datatype.number()
      );
      const arrThree: number[] = Array.apply(null, Array(2)).map(() =>
        datatype.number()
      );

      const data: number[][] = [arrThree, arrOne, arrTwo];
      const expected = [
        arrThree[0],
        arrOne[0],
        arrTwo[0],
        arrThree[1],
        arrOne[1],
      ];

      // Test
      const result: { data: number[]; [key: string]: any } = kMerge(data, 5);

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 2, "1": 2, "2": 1 });
    });

    it("should be able to handle returning 0 when no data from a source is added", () => {
      // Setup
      const arrOne: number[] = Array.apply(null, Array(4)).map(() =>
        datatype.number()
      );
      const arrTwo: number[] = Array.apply(null, Array(3)).map(() =>
        datatype.number()
      );
      const arrThree: number[] = Array.apply(null, Array(2)).map(() =>
        datatype.number()
      );

      const data: number[][] = [arrThree, arrOne, arrTwo];
      const expected = [arrThree[0], arrOne[0]];

      // Test
      const result: { data: number[]; [key: string]: any } = kMerge(data, 2);

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 1, "1": 1, "2": 0 });
    });
  });

  describe("sorted k-way merges", () => {
    it("should be able to handle 1 results set with data and 2 without", () => {
      // Setup
      const sortFunc = (a: number, b: number) => a - b;
      const fakeArray: number[] = Array.apply(null, Array(15))
        .map(() => datatype.number())
        .sort(sortFunc);

      const data: number[][] = [[], fakeArray, []];
      const expected = [...fakeArray];

      // Test
      const cmptr = (one: number[], two: number[]) => {
        if (one.length === 0) return two[0] ? 1 : 0;
        if (two.length === 0) return one[0] ? -1 : 0;
        return one[0] - two[0];
      };
      const result: { data: number[]; [key: string]: any } = kMerge(
        data,
        15,
        cmptr
      );

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 0, "1": 15, "2": 0 });
    });

    it("should be able to handle 2 results set with data and 1 without", () => {
      // Setup
      const sortFunc = (a: number, b: number) => a - b;
      const arrOne: number[] = Array.apply(null, Array(4))
        .map(() => datatype.number())
        .sort(sortFunc);
      const arrTwo: number[] = Array.apply(null, Array(3))
        .map(() => datatype.number())
        .sort(sortFunc);

      const data: number[][] = [[], arrOne, arrTwo];
      const expected = [...arrOne].concat([...arrTwo]).sort(sortFunc);

      // Test
      const cmptr = (one: number[], two: number[]) => {
        if (one.length === 0) return two[0] ? 1 : 0;
        if (two.length === 0) return one[0] ? -1 : 0;
        return one[0] - two[0];
      };
      const result: { data: number[]; [key: string]: any } = kMerge(
        data,
        10,
        cmptr
      );

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 0, "1": 4, "2": 3 });
    });

    it("should be able to handle 3 results set with data", () => {
      // Setup
      const sortFunc = (a: number, b: number) => a - b;
      const arrOne: number[] = Array.apply(null, Array(4))
        .map(() => datatype.number())
        .sort(sortFunc);
      const arrTwo: number[] = Array.apply(null, Array(3))
        .map(() => datatype.number())
        .sort(sortFunc);
      const arrThree: number[] = Array.apply(null, Array(2))
        .map(() => datatype.number())
        .sort(sortFunc);

      const data: number[][] = [arrThree, arrOne, arrTwo];
      const expected = [...arrOne]
        .concat([...arrTwo])
        .concat([...arrThree])
        .sort(sortFunc);

      // Test
      const cmptr = (one: number[], two: number[]) => {
        if (one.length === 0) return two[0] ? 1 : 0;
        if (two.length === 0) return one[0] ? -1 : 0;
        return one[0] - two[0];
      };
      const result: { data: number[]; [key: string]: any } = kMerge(
        data,
        10,
        cmptr
      );

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 2, "1": 4, "2": 3 });
    });

    it("should be able to handle limiting the final results", () => {
      // Setup
      const arrOne: number[] = [1, 5, 8, 10];
      const arrTwo: number[] = [-4, 3, 3, 6];
      const arrThree: number[] = [2, 4, 4, 7];

      const data: number[][] = [arrThree, arrOne, arrTwo];
      const expected = [-4, 1, 2, 3, 3];

      // Test
      const cmptr = (one: number[], two: number[]) => {
        if (one.length === 0) return two[0] ? 1 : 0;
        if (two.length === 0) return one[0] ? -1 : 0;
        return one[0] - two[0];
      };
      const result: { data: number[]; [key: string]: any } = kMerge(
        data,
        5,
        cmptr
      );

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 1, "1": 1, "2": 3 });
    });

    it("should be able to handle returning 0 when no data from a source is added", () => {
      // Setup
      const arrOne: number[] = [5, 5, 8, 10];
      const arrTwo: number[] = [-4, 3, 3, 6];
      const arrThree: number[] = [2, 4, 4, 7];

      const data: number[][] = [arrThree, arrOne, arrTwo];
      const expected = [-4, 2, 3, 3, 4];

      // Test
      const cmptr = (one: number[], two: number[]) => {
        if (one.length === 0) return two[0] ? 1 : 0;
        if (two.length === 0) return one[0] ? -1 : 0;
        return one[0] - two[0];
      };
      const result: { data: number[]; [key: string]: any } = kMerge(
        data,
        5,
        cmptr
      );

      // Assertions
      expect(result).toBeDefined();
      expect(result).toEqual({ data: expected, "0": 2, "1": 0, "2": 3 });
    });
  });
});
