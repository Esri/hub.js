import { IHubUserRequestOptions } from "../types";
import { ICreateVersionOptions, IVersion } from "./types";
import { getIncludeListFromItemType } from "./_internal/getIncludeListFromItemType";
import { getVersionData } from "./_internal/getVersionData";
import { getPrefix } from "./_internal/getPrefix";
import { getProp } from "../objects/get-prop";
import { mergeObjects } from "../objects/merge-objects";
import { objectToJsonBlob } from "../resources/object-to-json-blob";
import { createId } from "../util";
import { IModel } from "../types";
import {
  VERSION_RESOURCE_NAME,
  VERSION_RESOURCE_PROPERTIES,
} from "./_internal/constants";
import { addItemResource } from "@esri/arcgis-rest-portal";

/**
 * Creates and returns a new version of the entity
 * @param entity
 * @param requestOptions
 * @returns
 */
export async function createVersion(
  model: IModel,
  requestOptions: IHubUserRequestOptions,
  options?: ICreateVersionOptions
): Promise<IVersion> {
  const includeList = getIncludeListFromItemType(model);

  // TODO: in the future, we could make the data a separate resource file and reference it here with jsonref or something: { data: "#resources/data.json" }
  const data = getVersionData(model, includeList);
  const name = options?.name;
  const parent = options?.parentId;
  const id = createId();

  const prefix = getPrefix(id);
  const now = Date.now();
  const version: IVersion = {
    created: now,
    creator: getProp(requestOptions, "authentication.username"),
    data,
    id,
    name,
    parent,
    path: `${prefix}/${VERSION_RESOURCE_NAME}`,
    updated: now,
  };
  const versionBlob = objectToJsonBlob(version);

  const properties = mergeObjects(version, {}, VERSION_RESOURCE_PROPERTIES);

  await addItemResource({
    ...requestOptions,
    id: getProp(model, "item.id"),
    name: VERSION_RESOURCE_NAME,
    owner: getProp(model, "item.owner"),
    params: { properties },
    prefix,
    private: true,
    resource: versionBlob,
  });

  version.size = versionBlob.size;

  return version;
}
