import { IGroup, IItem } from "@esri/arcgis-rest-portal";
import { IDiscussionParams } from "../types";
import { parseDatasetId, IHubContent } from "@esri/hub-common";

/**
 * Utility that parses a discussion URI string into its component parts
 *
 * @export
 * @param {string} discussion
 * @return {*}  {IDiscussionParams}
 */
export function parseDiscussionURI(discussion: string): IDiscussionParams {
  let url;
  try {
    url = new URL(discussion);
  } catch (e) {
    throw new Error(`Invalid URI: ${discussion}`);
  }
  const source = url.protocol.replace(":", "");
  const [, , type, identifier] = url.pathname.split("/");
  let id;
  let layer;
  if (identifier) {
    const { itemId, layerId } = parseDatasetId(identifier);
    [id, layer] = [itemId, layerId];
  }
  const searchParams = new URLSearchParams(url.search.replace("?", ""));
  const features =
    (searchParams.has("id") && searchParams.get("id").split(",")) || null;
  const attribute =
    (searchParams.has("attribute") && searchParams.get("attribute")) || null;
  return {
    source,
    type,
    id: id || null,
    layer: layer || null,
    features,
    attribute,
  };
}

/**
 * NOT IMPLEMENTED: this will inspect a group"s properties to determine if it is "discussable"
 *
 * @export
 * @param {IGroup} group
 * @return {boolean}
 */
export function isGroupDiscussable(group: IGroup): boolean {
  /* tslint:disable no-console */
  console.warn(
    "DEPRECATED: Use isDiscussable() instead. isGroupDiscussable will be removed at v10.0.0"
  );
  return isDiscussable(group);
}

/**
 * NOT IMPLEMENTED: this will inspect an item"s properties to determine if it is "discussable"
 *
 * @export
 * @param {IItem} item
 * @return {boolean}
 */
export function isItemDiscussable(item: IItem): boolean {
  /* tslint:disable no-console */
  console.warn(
    "DEPRECATED: Use isDiscussable() instead. isItemDiscussable will be removed at v10.0.0"
  );
  return isDiscussable(item);
}

/**
 * Utility to determine if a given IGroup, IItem or IHubContent
 * is discussable.
 *
 * NOT IMPLEMENTED
 *
 * @param {IGroup|IItem|IHubContent} The subject to evaluate
 * @return {boolean}
 */
export function isDiscussable(subject: IGroup | IItem | IHubContent) {
  // TODO: implement
  return true;
}
