import { isArrayEqual } from "../../src/utils/array";

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
