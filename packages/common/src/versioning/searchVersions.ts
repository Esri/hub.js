import { getItemResources } from "@esri/arcgis-rest-portal";
import { IHubUserRequestOptions } from "../types";
import { IVersionMetadata } from "./types";
import { versionMetadataFromResource } from "./_internal/versionMetadataFromResource";

/**
 * Returns an array containing the versions of the specified item
 * @param id
 * @param requestOptions
 * @returns
 */
export async function searchVersions(
  id: string,
  requestOptions: IHubUserRequestOptions
): Promise<IVersionMetadata[]> {
  const resources = await getItemResources(id, {
    ...requestOptions,
    params: { sortField: "created", sortOrder: "desc" },
  });

  // the resources api does not support q - so we fetch all of them and do the filtering here

  return (
    resources.resources
      // filter out any that do not look like hubVersion_<id>/version.json
      .filter((resource: any) =>
        resource.resource.match(/^hubVersion_[a-zA-Z0-9_\s]*\/version.json/)
      )
      // transform the resouce into a version metadata object
      .map(versionMetadataFromResource)
  );
}
