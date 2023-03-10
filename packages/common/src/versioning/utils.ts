import { cloneObject } from "../util";
import { mergeObjects } from "../objects/merge-objects";
import { IHubUserRequestOptions, IModel } from "../types";
import { IVersion } from "./types/IVersion";
import { getVersion } from "./getVersion";
import { getIncludeListFromItemType } from "./_internal/getIncludeListFromItemType";

/**
 * Applies the versioned data to the model
 * @param model
 * @param version
 * @param includeList
 * @returns
 */
export function applyVersion(
  model: IModel,
  version: IVersion,
  includeList?: string[]
): IModel {
  if (!includeList) {
    includeList = getIncludeListFromItemType(model);
  }
  return mergeObjects(version.data, cloneObject(model), includeList);
}

interface IStaleVersionResponse {
  isStale: boolean;
  updated: number;
}

export async function checkForStaleVersion(
  itemId: string,
  version: IVersion,
  requestOptions: IHubUserRequestOptions
): Promise<IStaleVersionResponse> {
  const upstream = await getVersion(itemId, version.id, requestOptions);
  const isStale = upstream.updated > version.updated;
  return {
    isStale,
    updated: upstream.updated,
  };
}
