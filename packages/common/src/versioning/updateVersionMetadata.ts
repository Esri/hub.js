import { IHubUserRequestOptions } from "../types";
import { mergeObjects } from "../objects/merge-objects";
import { objectToJsonBlob } from "../resources/object-to-json-blob";
import { IVersionMetadata } from "./types";
import { getPrefix } from "./_internal/getPrefix";
import {
  VERSION_RESOURCE_NAME,
  VERSION_RESOURCE_PROPERTIES,
} from "./_internal/constants";
import { getVersion } from "./getVersion";
import { updateItemResource } from "@esri/arcgis-rest-portal";

/**
 * Updates the specified version's metadata
 * @param id
 * @param versionMetadata
 * @param owner
 * @param requestOptions
 * @returns
 */
export async function updateVersionMetadata(
  id: string,
  versionMetadata: IVersionMetadata,
  owner: string,
  requestOptions: IHubUserRequestOptions
): Promise<IVersionMetadata> {
  const prefix = getPrefix(versionMetadata.id);
  const properties = mergeObjects(
    versionMetadata,
    {},
    VERSION_RESOURCE_PROPERTIES
  );

  // fetch the whole version so we can update it
  const version = await getVersion(id, versionMetadata.id, requestOptions);
  // apply the metadata to the version
  mergeObjects(versionMetadata, version, VERSION_RESOURCE_PROPERTIES);
  const versionBlob = objectToJsonBlob(version);

  await updateItemResource({
    ...requestOptions,
    id,
    name: VERSION_RESOURCE_NAME,
    owner,
    params: { properties },
    prefix,
    resource: versionBlob,
  });

  return versionMetadata;
}
