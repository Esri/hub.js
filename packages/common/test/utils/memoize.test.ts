import { memoize, clearMemoizedCache } from "../../src";

describe("memoize:", () => {
  it("creates shared cache of the function, which has internal cache of outputs", () => {
    let callCount = 0;
    const fnToMemoize = (a: number, b: number) => {
      callCount++;
      return a + b;
    };

    const memoizedFn = memoize(fnToMemoize);
    expect(memoizedFn(1, 2)).toEqual(3);
    expect(memoizedFn(1, 2)).toEqual(3);
    expect(callCount).toBe(1);
    expect(memoizedFn(3, 4)).toEqual(7);
    expect(callCount).toBe(2);
    // call with args that should be cached
    expect(memoizedFn(1, 2)).toEqual(3);
    expect(memoizedFn(3, 4)).toEqual(7);
    // underlying function should still only be called twice
    expect(callCount).toBe(2);
    // function itself is cached, so createing a new memoized function
    // of the same thing, shares the cache
    const memoizedFn2 = memoize(fnToMemoize);
    expect(memoizedFn2(1, 2)).toEqual(3);
    expect(memoizedFn2(3, 4)).toEqual(7);
    // so call count should remain 2
    expect(callCount).toBe(2);
    // clear the cached function removes the function from the cache
    // but the memoized function still exists, and has it's own
    // value cache
    clearMemoizedCache(fnToMemoize.name);
    // repeated call, uses the cache...
    expect(memoizedFn(1, 2)).toEqual(3);
    expect(callCount).toBe(2);
    // new call, calls the underlying function
    expect(memoizedFn(9, 1)).toEqual(10);
    expect(callCount).toBe(3);

    // End test - nuke the cached function
    clearMemoizedCache(fnToMemoize.name);
  });
  it("works with complex args", () => {
    let callCount = 0;

    const addFn = (arg: { a: number; b: number }) => {
      callCount++;
      return arg.a + arg.b;
    };

    const memoizedFn = memoize(addFn);
    expect(memoizedFn({ a: 1, b: 2 })).toEqual(3);
    expect(memoizedFn({ a: 1, b: 2 })).toEqual(3);
    expect(callCount).toBe(1);
    // End test - nuke the cached function
    clearMemoizedCache(addFn.name);
  });
});
