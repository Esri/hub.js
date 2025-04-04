/**
 * concat an array of arrays
 * excluding any elements of the top level array
 * that are not actually arrays
 * @param arrays An array of arrays
 * @returns concatenated array
 * @private
 */
export const maybeConcat = (arrays: any[][]) => {
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
