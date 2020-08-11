import { getItemApiUrl } from "../urls";
import { IItem, IPortal } from "@esri/arcgis-rest-portal";

/**
 * Get the fully qualified URL to the item's data REST end point
 * @param item w/ id and access
 * @param portalRestUrl portal REST URL or portal URL
 * @param token (optional) - token for the current user's session
 */
export const getItemDataUrl = (
  item: IItem,
  portalOrUrl: string | IPortal,
  token?: string
) => {
  const url = getItemApiUrl(item, portalOrUrl, token);
  const segment = `/${item.id}`;
  const regExp = new RegExp(segment);
  return url && url.replace(regExp, `${segment}/data`);
};
