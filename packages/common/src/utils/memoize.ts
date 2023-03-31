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
 * Wrap a function into a memoized version of itself
 * `const memoizedItemSearch = memoize(searchItems);`
 * @param fn
 * @returns
 */
export const memoize = <ARGS extends unknown[], RET>(
  fn: (...args: ARGS) => RET
) => {
  if (!memoizedFnCache[fn.name]) {
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
    memoizedFnCache[fn.name] = memoizedFn;
  }
  return memoizedFnCache[fn.name];
};

/**
 * Clear the cache of a memoized function
 * @param fn
 */
export const clearMemoizedCache = (fnName: string) => {
  delete memoizedFnCache[fnName];
};
