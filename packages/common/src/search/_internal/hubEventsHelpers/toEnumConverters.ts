/**
 * Converts a string to an enum value
 *
 * strings not in the enum will be returned as the original string
 */
export function toEnum<T>(value: string, enumType: T): T[keyof T] {
  return (
    (enumType as any)[value] ||
    (enumType as any)[value.toUpperCase()] ||
    (enumType as any)[value.toLowerCase()] ||
    value
  );
}

/**
 * Converts an array of strings to an array of enum values
 *
 * strings not in the enum will be returned as the original string
 */
export function toEnums<T>(values: string[], enumType: T): Array<T[keyof T]> {
  return values.map((value) => toEnum<T>(value, enumType));
}
