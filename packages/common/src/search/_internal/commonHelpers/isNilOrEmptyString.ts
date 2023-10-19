/**
 * Determines whether a value is null, undefined, or an empty string.
 * This is particularly useful when 0 and false are considered meaningful values
 * @param value value to check
 * @returns whether the value is null, undefined, or an empty string
 */
export function isNilOrEmptyString(value: any) {
  return value == null || value === "";
}
