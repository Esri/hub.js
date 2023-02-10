import { getResourceNameFromVersionId } from "./_internal/getResourceNameFromVersionId";
import { removeItemResource } from "@esri/arcgis-rest-portal";
import { IHubUserRequestOptions } from "../types";

/**
 * Deletes the version specified by the entity id and versionId
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
  requestOptions: IHubUserRequestOptions
): Promise<{ success: boolean }> {
  return removeItemResource({
    ...requestOptions,
    id,
    owner,
    resource: getResourceNameFromVersionId(versionId),
  });
}
