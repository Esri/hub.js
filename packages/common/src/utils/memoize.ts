/**
 * Create a cache key from an array of arguments
 * @param args
 * @returns
 */
const createCacheKeyFromArgs = (args: any[]) =>
  args.reduce(
    (cacheKey, arg) =>
      (cacheKey += `_${
        typeof arg === "object" ? JSON.stringify(args) : `${arg}`
      }_`),
    ""
  );

const memoizedFnCache: Record<string, any> = {};
/**
 * Wrap a function into a memoized version of itself. Multiple calls for the same function
 * will return the same memoized function - thus enabling a shared cache of results.
 * `const memoizedItemSearch = memoize(searchItems);`
 * @param fn
 * @returns
 */
export const memoize = <ARGS extends unknown[], RET>(
  fn: (...args: ARGS) => RET
) => {
  if (!memoizedFnCache[`_${fn.name}`]) {
    const cache: Record<string, RET> = {};

    const memoizedFn = (...args: ARGS) => {
      const cacheKey = createCacheKeyFromArgs(args);
      if (cache[cacheKey]) {
        return cache[cacheKey];
      }

      const asyncFn = fn.call(undefined, ...args);
      cache[cacheKey] = asyncFn;
      return asyncFn;
    };
    memoizedFnCache[`_${fn.name}`] = memoizedFn;
  }
  return memoizedFnCache[`_${fn.name}`];
};

/**
 * Clear the cache of a memoized function
 * If no function name is provided, the entire cache is cleared
 * This is useful for testing, but should not be used in production
 * @param fn
 */
export const clearMemoizedCache = (fnName?: string) => {
  if (!fnName) {
    Object.keys(memoizedFnCache).forEach((key) => {
      delete memoizedFnCache[key];
    });
    return;
  } else {
    delete memoizedFnCache[`_${fnName}`];
  }
};
