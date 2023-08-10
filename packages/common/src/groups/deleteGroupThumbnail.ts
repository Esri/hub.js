import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { request } from "@esri/arcgis-rest-request";

/**
 * Delete a group's thumbnail
 * @param id
 * @param owner
 * @param requestOptions
 * @returns
 */
export async function deleteGroupThumbnail(
  id: string,
  requestOptions: IUserRequestOptions
) {
  const { portal } = requestOptions;
  const urlPath = `${portal}/community/groups/${id}/deleteThumbnail`;
  return request(urlPath, requestOptions);
}
