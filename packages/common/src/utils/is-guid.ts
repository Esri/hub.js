/**
 * Is a String a GUID?
 * @param {string} stringToTest string to check if it's a GUID
 */
export function isGuid(stringToTest: string): boolean {
  // strip curlies if sent...
  if (stringToTest[0] === "{") {
    stringToTest = stringToTest.substring(1, stringToTest.length - 1);
  }
  // ughh... seems legit
  const regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}[-]?[0-9a-fA-F]{4}[-]?[0-9a-fA-F]{4}[-]?[0-9a-fA-F]{4}[-]?[0-9a-fA-F]{12}(\}){0,1}$/gi;
  // test
  return regexGuid.test(stringToTest);
}
