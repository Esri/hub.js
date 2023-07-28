import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { request } from "@esri/arcgis-rest-request";

/**
 * Delete an item's thumbnail
 * @param id
 * @param owner
 * @param requestOptions
 * @returns
 */
export async function deleteItemThumbnail(
  id: string,
  owner: string,
  requestOptions: IUserRequestOptions
) {
  const { portal } = requestOptions;
  const urlPath = `${portal}/content/users/${owner}/items/${id}/deleteThumbnail`;
  return request(urlPath, requestOptions);
}
