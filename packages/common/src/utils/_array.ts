/**
 * concat an array of arrays
 * excluding any elements of the top level array
 * that are not actually arrays
 * @param arrays An array of arrays
 * @returns concatenated array
 * @private
 */
export const maybeConcat = (arrays: any[][]) => {
  // eslint-disable-next-line prefer-spread
  const result = [].concat.apply([], arrays.filter(Array.isArray));
  return result.length ? result : undefined;
};

/**
 * Splits a single array into many arrays of a given max length.
 * E.g. splitArrayByLength(['a', 'b', 'c'], 2); // => [['a', 'b'], ['c']]
 * @param originalValues The original array of values
 * @param length The max length of the resulting arrays
 * @returns an array of arrays
 */
export function splitArrayByLength<T>(
  originalValues: T[],
  length: number
): T[][] {
  return originalValues.reduce((splits, originalValue) => {
    let split = splits[splits.length - 1];
    if (!split || split.length === length) {
      split = [];
      splits.push(split);
    }
    split.push(originalValue);
    return splits;
  }, []);
}

/**
 * Determines if two arrays are shallowly equal.
 *
 * @param a - The first array to compare.
 * @param b - The second array to compare.
 * @returns True if both arrays are the same reference or contain identical elements in the same order; otherwise, false.
 */
export function isArrayEqual(a: unknown[], b: unknown[]): boolean {
  if (a === b) {
    return true;
  }
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((_, i) => a[i] === b[i]);
}
