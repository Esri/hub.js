import { getItemResource } from "@esri/arcgis-rest-portal";
import { IHubUserRequestOptions } from "../types";
import { IVersion } from "./types";
import { getResourceNameFromVersionId } from "./_internal/getResourceNameFromVersionId";

/**
 * Returns an IVersion object for the specified entity id and versionId
 * @param id
 * @param versionId
 * @param requestOptions
 * @returns
 */
export async function getVersion(
  id: string,
  versionId: string,
  requestOptions: IHubUserRequestOptions
): Promise<IVersion> {
  return getItemResource(id, {
    ...requestOptions,
    fileName: getResourceNameFromVersionId(versionId),
    readAs: "json",
  });
}
