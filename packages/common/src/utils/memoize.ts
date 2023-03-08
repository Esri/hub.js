const createCacheKeyFromArgs = (args: any[]) =>
  args.reduce(
    (cacheKey, arg) =>
      (cacheKey += `_${
        typeof arg === "object" ? JSON.stringify(args) : `${arg}`
      }_`),
    ""
  );

/**
 * Wrap a function into a memoized version of itself
 * `const memoizedItemSearch = memoize(searchItems);`
 * @param fn
 * @returns
 */
export const memoize = <ARGS extends unknown[], RET>(
  fn: (...args: ARGS) => RET
) => {
  const cache: Record<string, RET> = {};

  return (...args: ARGS) => {
    const cacheKey = createCacheKeyFromArgs(args);

    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    const asyncFn = fn.call(undefined, ...args);
    cache[cacheKey] = asyncFn;
    return asyncFn;
  };
};
