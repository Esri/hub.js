import { getSiteEditUrl } from "./get-site-edit-url";
import { IItem } from "@esri/arcgis-rest-types";

/**
 * DEPRECATED!!!! - use getSiteEditUrl
 *
 * Get the correct url used to edit the site
 * @param item the site item
 */
/* istanbul ignore next */
export function getEditUrl(item: IItem) {
  /* istanbul ignore next */
  return getSiteEditUrl(item);
}
