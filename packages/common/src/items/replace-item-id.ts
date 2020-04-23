import { IModel } from "../types";
import { cloneObject } from "../util";
import { deepStringReplace } from "../objects";

/**
 * Replaces instances of item ids on an item model
 * @param {Object} obj Object graph to traverse
 * @param {string} itemId id to replace with `{{appid}}`
 */
export function replaceItemId(
  obj: IModel | Record<string, any>,
  itemId: string,
  replacement = "{{appid}}"
) {
  const clone = cloneObject(obj);
  const re = new RegExp(itemId, "g");
  return deepStringReplace(clone, re, replacement);
}
