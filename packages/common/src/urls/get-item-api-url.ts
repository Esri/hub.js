import { getPortalUrl, buildUrl } from "../urls";
import { IItem, IPortal } from "@esri/arcgis-rest-portal";

// NOTE: this fn is tested via getItemDataUrl tests
/**
 * Get the fully qualified URL to the item's REST end point
 * @param item w/ id and access
 * @param portalRestUrl portal REST URL or portal URL
 * @param token (optional) - token for the current user's session
 */
export const getItemApiUrl = (
  item: IItem,
  portalOrUrl: string | IPortal,
  token?: string
) => {
  const { id, access } = item;
  const host =
    typeof portalOrUrl === "string" ? portalOrUrl : getPortalUrl(portalOrUrl);
  // TODO: handle case where Portal API url is passed in?
  // const portalUrl = parsePortalUrl(portalRestUrl);
  const path = `/sharing/rest/content/items/${id}`;
  // TODO: append f param based on item.type?
  let query;
  if (access !== "public") {
    query = { token };
  }
  return buildUrl({
    host,
    path,
    query
  });
};
