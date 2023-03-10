import { IHubUserRequestOptions } from "../types";
import { getProp } from "../objects/get-prop";
import { mergeObjects } from "../objects/merge-objects";
import { objectToJsonBlob } from "../resources/object-to-json-blob";
import { IModel } from "../types";
import { IVersion } from "./types";
import { getPrefix } from "./_internal/getPrefix";
import { getVersionData } from "./_internal/getVersionData";
import {
  VERSION_RESOURCE_NAME,
  VERSION_RESOURCE_PROPERTIES,
} from "./_internal/constants";
import { getIncludeListFromItemType } from "./_internal/getIncludeListFromItemType";
import { updateItemResource } from "@esri/arcgis-rest-portal";
import { checkForStaleVersion } from "./utils";

class StaleVersionError extends Error {
  constructor(id: string, public updated: number) {
    super(`Version ${id} is stale. Use force to overwrite.`);
    this.name = "StaleVersionError";
  }
}

/**
 * Updates the specified version with with the state of the supplied model
 * @param model
 * @param version
 * @param requestOptions
 * @returns
 */
export async function updateVersion(
  model: IModel,
  version: IVersion,
  requestOptions: IHubUserRequestOptions,
  force?: boolean
): Promise<IVersion> {
  // we expect the model to contain the changes that we want to apply to the version
  // but we also need the versionResource so we can preserve the created and creator props

  if (!force) {
    const isStaleResponse = await checkForStaleVersion(
      model.item.id,
      version,
      requestOptions
    );
    if (isStaleResponse.isStale) {
      throw new StaleVersionError(version.id, isStaleResponse.updated);
    }
  }

  const includeList = getIncludeListFromItemType(model);
  version.data = getVersionData(model, includeList);

  const prefix = getPrefix(version.id);
  version.updated = Date.now();
  const versionBlob = objectToJsonBlob(version);

  const properties = mergeObjects(version, {}, VERSION_RESOURCE_PROPERTIES);

  await updateItemResource({
    ...requestOptions,
    id: getProp(model, "item.id"),
    name: VERSION_RESOURCE_NAME,
    owner: getProp(model, "item.owner"),
    params: { properties },
    prefix,
    private: true,
    resource: versionBlob,
  });

  return version;
}
