import { IItem } from "@esri/arcgis-rest-portal";
import { isSite } from "./is-site";

/**
 * Determines whether, given a type and typekeywords, the input is
 * a site item type or not
 * @param type - the type value on the item
 * @param typeKeywords - the typeKeywords on the item
 */

export function isSiteType(type: string, typeKeywords: string[] = []) {
  return isSite({ type, typeKeywords } as IItem);
}
