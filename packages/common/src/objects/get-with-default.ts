import { getProp } from "./get-prop";

/**
 * Gets the value of a property from an object with a
 * default if that prop is undefined
 * @param obj
 * @param prop
 * @param def
 */
export function getWithDefault(
  obj: { [key: string]: any },
  prop: string,
  def: any
): any {
  const res = getProp(obj, prop);
  return res !== undefined ? res : def;
}
