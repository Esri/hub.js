import { deepEqual } from "../../src/objects/deepEqual";

describe("deepEqual:", () => {
  it("works for primatives", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual("a", "a")).toBe(true);
    expect(deepEqual("a", "b")).toBe(false);
  });
  it("works for null and undefined", () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(undefined, null)).toBe(false);
  });
  it("works for objects", () => {
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });
  it("handles mixed types", () => {
    expect(deepEqual({ a: 1, b: 2 }, [{ a: 1, b: "2" }])).toBe(false);
  });
  it("works for arrays of objects", () => {
    expect(deepEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
    expect(deepEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(false);
  });
  it("works for same objects", () => {
    const chk = { a: 1, b: 2 };
    expect(deepEqual(chk, chk)).toBe(true);
    const clone = { ...chk };
    expect(deepEqual(chk, clone)).toBe(true);
    const clone2 = { ...chk, c: 3 };
    expect(deepEqual(chk, clone2)).toBe(false);
  });
});
