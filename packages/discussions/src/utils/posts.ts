import { IGroup, IItem } from "@esri/arcgis-rest-portal";
import { IDiscussionParams } from "../types";
import * as UrlParse from "url-parse";

/**
 * Utility that parses a discussion URI string into its component parts
 *
 * @export
 * @param {string} discussion
 * @return {*}  {IDiscussionParams}
 */
export function parseDiscussionURI(discussion: string): IDiscussionParams {
  // pass it through browser/node URL to invalidate plain strings
  const uri = new URL(discussion) && new UrlParse(discussion);
  const source = uri.protocol.slice(0, -1); // removes ":"
  const type = uri.hostname;
  const [, identifier] = uri.pathname.split("/");
  const [id, layer = null] = identifier.split("_");
  const searchParams = new URLSearchParams(uri.query);
  const features =
    (searchParams.has("id") && searchParams.get("id").split(",")) || null;
  const attribute =
    (searchParams.has("attribute") && searchParams.get("attribute")) || null;
  return {
    source,
    type,
    id: id || null,
    layer,
    features,
    attribute
  };
}

/**
 * NOT IMPLEMENTED: this will inspect a group's properties to determine if it is "discussable"
 *
 * @export
 * @param {IGroup} group
 * @return {*}  {boolean}
 */
export function isGroupDiscussable(group: IGroup): boolean {
  return true;
}

/**
 * NOT IMPLEMENTED: this will inspect an item's properties to determine if it is "discussable"
 *
 * @export
 * @param {IItem} item
 * @return {*}  {boolean}
 */
export function isItemDiscussable(item: IItem): boolean {
  return true;
}
