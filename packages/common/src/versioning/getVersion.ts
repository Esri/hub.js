import { getItemResource } from "@esri/arcgis-rest-portal";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IVersion } from "./types";
import { getResourceNameFromVersionId } from "./_internal";

/**
 * Return an array containing the versions of the item
 * @param id
 * @param versionId
 * @param requestOptions
 * @returns
 */
export async function getVersion(
  id: string,
  versionId: string,
  requestOptions: IUserRequestOptions
): Promise<IVersion> {
  return getItemResource(id, {
    ...requestOptions,
    fileName: getResourceNameFromVersionId(versionId),
    readAs: "json",
  });
}
