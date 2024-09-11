/**
 * Determines if the provided `stringToTest` matches CUID format
 * @param stringToTest The string to evaluate
 * @returns true when stringToTest matches CUID format
 */
export function isCuid(stringToTest: string): boolean {
  const regexCuid = /^c[a-z0-9]{24}$/;
  return typeof stringToTest === 'string' && regexCuid.test(stringToTest);
}