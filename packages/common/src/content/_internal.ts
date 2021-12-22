/**
 * Use this module for functions that do not need to be used by consumers (yet),
 * but may be shared between hub.js modules, and/or need to be tested
 * to get 100% coverage w/o writing cumbersome tests of higher level functions.
 *
 * Consuming will not be able to import these functions.
 *
 * It's probably a good pattern to add functions here first and then
 * move them to index.ts only when they are needed by a consumer.
 */

import {
  BBox,
  IHubContent,
  IHubGeography,
  GeographyProvenance,
} from "../types";
import { bBoxToPolygon, isBBox } from "../extent";

/**
 * Create a new content with updated boundary properties
 * @param content original content
 * @param boundary boundary provenance
 * @returns
 */
export const setContentBoundary = (
  content: IHubContent,
  boundary: GeographyProvenance
) => {
  // update content's item and boundary
  const properties = { ...(content.item.properties || {}), boundary };
  const item = { ...content.item, properties };
  const updated = { ...content, item };
  return { ...updated, boundary: getContentBoundary(updated) };
};

/**
 * Create a new content with updated extent and derived properties like boundary
 * @param content original content
 * @param extent new extent
 * @returns a new content with the updated extent and boundary
 */
export const setContentExtent = (
  content: IHubContent,
  extent: BBox
): IHubContent => {
  // update content's item and extent
  const item = { ...content.item, extent };
  const updated = { ...content, item, extent };
  // derive boundary from content properties
  const boundary = getContentBoundary(updated);
  return { ...updated, boundary };
};

const getContentBoundary = (content: IHubContent): IHubGeography => {
  const item = content.item;
  const extent = item.extent;
  const isValidItemExtent = isBBox(extent);
  // user specified provenance is stored in item.properties
  const provenance: GeographyProvenance =
    item.properties?.boundary ||
    // but we default to item if the item has an extent
    (isValidItemExtent ? "item" : undefined);
  let geometry;
  switch (provenance) {
    case "item":
      geometry = isValidItemExtent ? bBoxToPolygon(extent) : null;
      break;
    case "none":
      geometry = null;
      break;
    // TODO: handle other provenances
  }
  // TODO: derive and return center
  return {
    provenance,
    geometry,
  };
};
