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
