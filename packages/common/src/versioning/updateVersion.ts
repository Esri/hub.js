import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { getProp, IModel, mergeObjects, objectToJsonBlob } from "../index";
import { IVersion } from "./types";
import {
  getPrefix,
  getVersionData,
  VERSION_RESOURCE_NAME,
  VERSION_RESOURCE_PROPERTIES,
} from "./_internal";
import { getIncludeListFromItemType } from "./utils";
import { updateItemResource } from "@esri/arcgis-rest-portal";

/**
 * Return an array containing the versions of the item
 * @param model
 * @param versionId
 * @param requestOptions
 * @returns
 */
export async function updateVersion(
  model: IModel,
  version: IVersion,
  requestOptions: IUserRequestOptions
): Promise<IVersion> {
  // we expect the item to contain the changes that we want to apply to the version
  // but we also need the versionResource so we can preserve the created and creator props

  // TODO: we should fetch the version and ensure that its updated date is not newer than what we have in memory

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
    private: false,
    resource: versionBlob,
  });

  return version;
}
