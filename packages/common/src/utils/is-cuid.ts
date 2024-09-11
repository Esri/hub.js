export function isCuid(stringToTest: string): boolean {
  const regexCuid = /^c[a-z0-9]{24}$/;
  return typeof stringToTest === 'string' && regexCuid.test(stringToTest);
}