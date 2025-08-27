import {
  maybeConcat,
  splitArrayByLength,
  isArrayEqual,
} from "../../src/utils/_array";

describe("maybeConcat", () => {
  it("returns undefined when no arrays", () => {
    const result = maybeConcat([undefined, null]);
    expect(result).toBeUndefined();
  });
  it("returns concatenated array of only array elements", () => {
    const result = maybeConcat([[1, 2], undefined, [3, 4]]);
    expect(result).toEqual([1, 2, 3, 4]);
  });
  it("returns concatenated array of all elements", () => {
    const result = maybeConcat([
      [1, 2],
      [3, 4],
    ]);
    expect(result).toEqual([1, 2, 3, 4]);
  });
});

describe("splitArrayByLength", () => {
  it("should convert a single array into multiple arrays of the given max length", () => {
    const results = splitArrayByLength<string>(["a", "b", "c"], 2);
    expect(results).toEqual([["a", "b"], ["c"]]);
  });
});

describe("isArrayEqual", () => {
  it("returns true for the same reference", () => {
    const arr = [1, 2, 3];
    expect(isArrayEqual(arr, arr)).toBe(true);
  });

  it("returns true for arrays with the same elements in the same order", () => {
    expect(isArrayEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it("returns false for arrays with different elements", () => {
    expect(isArrayEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it("returns false for arrays with different lengths", () => {
    expect(isArrayEqual([1, 2, 3], [1, 2])).toBe(false);
  });

  it("returns false if either argument is not an array", () => {
    expect(isArrayEqual([1, 2, 3], null)).toBe(false);
    expect(isArrayEqual(null, [1, 2, 3])).toBe(false);
    expect(isArrayEqual("not-an-array" as any, [1, 2, 3])).toBe(false);
  });
});
