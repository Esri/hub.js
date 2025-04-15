import { maybeConcat, splitArrayByLength } from "../../src/utils/_array";

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
