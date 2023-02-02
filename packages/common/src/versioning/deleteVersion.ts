import { getResourceNameFromVersionId } from "./_internal";
import { removeItemResource } from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Return an array containing the versions of the item
 * @param id
 * @param versionId
 * @param owner
 * @param requestOptions
 * @returns
 */
export async function deleteVersion(
  id: string,
  versionId: string,
  owner: string,
  requestOptions: IUserRequestOptions
): Promise<{ success: boolean }> {
  return removeItemResource({
    ...requestOptions,
    id,
    owner,
    resource: getResourceNameFromVersionId(versionId),
  });
}
