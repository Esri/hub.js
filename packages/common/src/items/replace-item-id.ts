import { IItem } from "@esri/arcgis-rest-types";
import { IItemTemplate } from "../types";
import { cloneObject } from "../util";
import { deepStringReplace } from "../objects";

/**
 * Replaces instances of item ids on an item model
 * @param {Object} obj Object graph to traverse
 * @param {string} itemId id to replace with `{{appid}}`
 */
export function replaceItemId(
  obj: IItem | IItemTemplate,
  itemId: string,
  replacement = "{{appid}}"
) {
  const clone = cloneObject(obj);
  const re = new RegExp(itemId, "g");
  return deepStringReplace(clone, re, replacement);
}
