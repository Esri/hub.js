/**
 * Check if an object has a specific property in a type-safe manner
 * that meets the eslint rule `@typescript-eslint/no-prototype-builtins`.
 * @param obj
 * @param prop
 * @returns
 */
export function hasOwnProperty<
  T extends Record<string, unknown>,
  K extends PropertyKey
>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
