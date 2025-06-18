import { EntityType } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { ApiTarget } from "../../types/types";
import { shouldUseOgcApi } from "./shouldUseOgcApi";
import { shouldUseDiscussionsApi } from "./shouldUseDiscussionsApi";
import { shouldUseEventsApi } from "./shouldUseEventsApi";

/**
 * @private
 * Determines Which API should be hit for the given search parameters.
 * Defaults to the Portal API unless parameters indicate that a Hub API should be used.
 * @param targetEntity target entity of the query
 * @param options search options
 * @returns the target API, either 'portal' or 'hub'
 */
export function getApi(
  targetEntity: EntityType,
  options: IHubSearchOptions
): ApiTarget {
  let result: ApiTarget = "portal";
  if (
    shouldUseDiscussionsApi(targetEntity, options) ||
    shouldUseEventsApi(targetEntity, options) ||
    shouldUseOgcApi(targetEntity, options)
  ) {
    result = "hub";
  }

  return result;
}
