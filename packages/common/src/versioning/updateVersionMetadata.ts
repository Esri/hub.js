import { IHubUserRequestOptions } from "../types";
import { mergeObjects } from "../objects/merge-objects";
import { IVersionMetadata } from "./types";
import { getPrefix } from "./_internal/getPrefix";
import {
  VERSION_RESOURCE_NAME,
  VERSION_RESOURCE_PROPERTIES,
} from "./_internal/constants";
import { updateItemResource } from "@esri/arcgis-rest-portal";

/**
 * Updates the specified version's metadata
 * @param id
 * @param version
 * @param requestOptions
 * @returns
 */
export async function updateVersionMetadata(
  id: string,
  version: IVersionMetadata,
  requestOptions: IHubUserRequestOptions
): Promise<IVersionMetadata> {
  const prefix = getPrefix(version.id);
  const properties = mergeObjects(version, {}, VERSION_RESOURCE_PROPERTIES);

  await updateItemResource({
    ...requestOptions,
    id,
    name: VERSION_RESOURCE_NAME,
    owner: properties.creator,
    params: { properties },
    prefix,
  });

  return version;
}
