import { getItemGroups, IGroup } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * @private
 * Return the list of groups the current user can see, that the item is shared to
 * @param itemId
 * @param requestOptions
 * @returns
 */

export async function sharedWith(
  itemId: string,
  requestOptions: IRequestOptions
): Promise<IGroup[]> {
  const response = await getItemGroups(itemId, requestOptions);
  // simplify the response to a single array
  return [...response.admin, ...response.member, ...response.other];
}
