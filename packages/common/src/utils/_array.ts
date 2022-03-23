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
